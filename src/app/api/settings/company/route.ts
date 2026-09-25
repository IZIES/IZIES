import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await prisma.systemSetting.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      return NextResponse.json({ success: true, settings: null });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("GET /api/settings/company error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch company settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const updated = await prisma.systemSetting.upsert({
      where: { id: "default" },
      update: {
        contactEmail: body.contactEmail?.trim() || null,
        contactPhone: body.contactPhone?.trim() || null,
        officeAddress: body.officeAddress?.trim() || null,
        linkedinUrl: body.linkedinUrl?.trim() || null,
        twitterUrl: body.twitterUrl?.trim() || null,
        githubUrl: body.githubUrl?.trim() || null,
        instagramUrl: body.instagramUrl?.trim() || null,
        globeUrl: body.globeUrl?.trim() || null,
      },
      create: {
        id: "default",
        contactEmail: body.contactEmail?.trim() || null,
        contactPhone: body.contactPhone?.trim() || null,
        officeAddress: body.officeAddress?.trim() || null,
        linkedinUrl: body.linkedinUrl?.trim() || null,
        twitterUrl: body.twitterUrl?.trim() || null,
        githubUrl: body.githubUrl?.trim() || null,
        instagramUrl: body.instagramUrl?.trim() || null,
        globeUrl: body.globeUrl?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error("PUT /api/settings/company error:", error);
    return NextResponse.json({ success: false, error: "Failed to update company settings" }, { status: 500 });
  }
}
