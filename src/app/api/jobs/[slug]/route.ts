import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const job = await prisma.job.findUnique({
      where: { slug },
      include: {
        department: {
          select: { id: true, name: true, slug: true, description: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job opening not found" },
        { status: 404 }
      );
    }

    // Increment view count asynchronously
    await prisma.job.update({
      where: { id: job.id },
      data: { viewsCount: { increment: 1 } },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      job,
    });
  } catch (error: any) {
    console.error("GET /api/jobs/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
