import { NextRequest, NextResponse } from "next/server";
import { prisma, InquiryStatus } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const SYNC_SECRET = process.env.IZIES_SYNC_SECRET || "izies_premiumfree_sync_secret_2026";

export async function GET(req: NextRequest) {
  const secretParam = req.nextUrl.searchParams.get("secret");
  const secretHeader = req.headers.get("x-sync-secret");
  const hasValidSecret = (secretParam === SYNC_SECRET) || (secretHeader === SYNC_SECRET);

  if (!hasValidSecret) {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const statusParam = req.nextUrl.searchParams.get("status");
    const search = req.nextUrl.searchParams.get("search")?.trim();

    const whereClause: any = {};

    if (statusParam && Object.values(InquiryStatus).includes(statusParam as InquiryStatus)) {
      whereClause.status = statusParam;
    }

    if (search) {
      whereClause.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { companyName: { contains: search, mode: "insensitive" } },
        { service: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const inquiries = await prisma.contactInquiry.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    const counts = {
      total: await prisma.contactInquiry.count(),
      new: await prisma.contactInquiry.count({ where: { status: "NEW" } }),
      inReview: await prisma.contactInquiry.count({ where: { status: "IN_REVIEW" } }),
      contacted: await prisma.contactInquiry.count({ where: { status: "CONTACTED" } }),
      converted: await prisma.contactInquiry.count({ where: { status: "CONVERTED" } }),
      archived: await prisma.contactInquiry.count({ where: { status: "ARCHIVED" } }),
    };

    return NextResponse.json({
      success: true,
      inquiries,
      counts,
    });
  } catch (error: any) {
    console.error("GET /api/admin/inquiries error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, companyName, service, budget, description, source } = body;

    if (!fullName || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 });
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        companyName: companyName?.trim() || null,
        service: service?.trim() || "AI Solution",
        budget: budget?.trim() || null,
        description: description?.trim() || null,
        source: source || "api_injection",
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/inquiries error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create inquiry" }, { status: 500 });
  }
}
