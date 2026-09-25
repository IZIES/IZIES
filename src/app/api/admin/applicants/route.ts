import { NextRequest, NextResponse } from "next/server";
import { prisma, ApplicationStatus } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status") as ApplicationStatus | null;

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (jobId && jobId !== "all") {
      where.jobId = jobId;
    }

    if (status && status !== ("all" as any)) {
      where.status = status;
    }

    const [applicants, jobs] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          job: {
            select: { id: true, title: true, department: { select: { name: true } } },
          },
          candidate: {
            select: {
              headline: true,
              skills: true,
              projects: true,
              githubUrl: true,
              linkedInUrl: true,
              portfolioUrl: true,
              bio: true,
            },
          },
          notes: {
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { author: { select: { name: true } } },
          },
          statusHistory: {
            take: 3,
            orderBy: { createdAt: "desc" },
            include: { changedBy: { select: { name: true } } },
          },
        },
      }),
      prisma.job.findMany({
        select: { id: true, title: true },
        orderBy: { title: "asc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      applicants,
      jobs,
    });
  } catch (error: any) {
    console.error("GET /api/admin/applicants error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applicants" },
      { status: 500 }
    );
  }
}
