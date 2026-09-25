import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        department: true,
        applications: {
          orderBy: { createdAt: "desc" },
          include: {
            candidate: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
                collegeName: true,
                degree: true,
                branch: true,
                graduationYear: true,
                cgpa: true,
                resumeUrl: true,
              },
            },
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ success: false, error: "Job opening not found" }, { status: 404 });
    }

    // Status breakdown for THIS specific job
    const applicationsByStatusRaw = await prisma.application.groupBy({
      where: { jobId: id },
      by: ["status"],
      _count: { status: true },
    });

    const statusCounts: Record<string, number> = {};
    applicationsByStatusRaw.forEach((item) => {
      statusCounts[item.status] = item._count.status;
    });

    return NextResponse.json({
      success: true,
      job,
      statusCounts,
    });
  } catch (error: any) {
    console.error("GET /api/admin/jobs/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch job details" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json();

    const job = await prisma.job.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.status && { status: body.status }),
        ...(body.location && { location: body.location }),
        ...(body.workplaceType && { workplaceType: body.workplaceType }),
        ...(body.employmentType && { employmentType: body.employmentType }),
        ...(body.experienceLevel && { experienceLevel: body.experienceLevel }),
        ...(body.salaryRange !== undefined && { salaryRange: body.salaryRange }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl || null }),
        ...(body.skills !== undefined && { skills: body.skills }),
        ...(body.aboutRole && { aboutRole: body.aboutRole }),
        ...(body.responsibilities && { responsibilities: body.responsibilities }),
        ...(body.requirements && { requirements: body.requirements }),
        ...(body.benefits && { benefits: body.benefits }),
        ...(body.deadline !== undefined && { deadline: body.deadline ? new Date(body.deadline) : null }),
      },
    });

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    console.error("PATCH /api/admin/jobs/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Job deleted" });
  } catch (error: any) {
    console.error("DELETE /api/admin/jobs/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete job" }, { status: 500 });
  }
}
