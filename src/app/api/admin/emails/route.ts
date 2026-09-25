import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const emails = await prisma.emailNotification.findMany({
      orderBy: { sentAt: "desc" },
      take: 100,
      include: {
        application: {
          select: {
            id: true,
            fullName: true,
            email: true,
            job: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    const totalCount = await prisma.emailNotification.count();

    const stageCounts = await prisma.emailNotification.groupBy({
      by: ["stage"],
      _count: true,
    });

    return NextResponse.json({
      success: true,
      totalCount,
      stageCounts,
      emails,
    });
  } catch (error: any) {
    console.error("GET /api/admin/emails error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch email logs" },
      { status: 500 }
    );
  }
}
