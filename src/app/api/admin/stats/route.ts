import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      totalJobs,
      publishedJobs,
      totalApplications,
      applicationsThisWeek,
      applicationsByStatusRaw,
      recentApplications,
    ] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: "PUBLISHED" } }),
      prisma.application.count(),
      prisma.application.count({
        where: { createdAt: { gte: oneWeekAgo } },
      }),
      prisma.application.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.application.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          job: {
            select: { title: true, department: { select: { name: true } } },
          },
        },
      }),
    ]);

    const statusCounts: Record<string, number> = {};
    applicationsByStatusRaw.forEach((item) => {
      statusCounts[item.status] = item._count.status;
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalJobs,
        publishedJobs,
        totalApplications,
        applicationsThisWeek,
        statusCounts,
        recentApplications,
      },
    });
  } catch (error: any) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}
