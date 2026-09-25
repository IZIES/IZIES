import { NextRequest, NextResponse } from "next/server";
import { prisma, EmploymentType, ExperienceLevel, WorkplaceType } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const department = searchParams.get("department");
    const employmentType = searchParams.get("employmentType") as EmploymentType | null;
    const workplaceType = searchParams.get("workplaceType") as WorkplaceType | null;
    const experienceLevel = searchParams.get("experienceLevel") as ExperienceLevel | null;

    const where: any = {
      status: "PUBLISHED",
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { aboutRole: { contains: search, mode: "insensitive" } },
      ];
    }

    if (department && department !== "all") {
      where.department = { slug: department };
    }

    if (employmentType && employmentType !== ("all" as any)) {
      where.employmentType = employmentType;
    }

    if (workplaceType && workplaceType !== ("all" as any)) {
      where.workplaceType = workplaceType;
    }

    if (experienceLevel && experienceLevel !== ("all" as any)) {
      where.experienceLevel = experienceLevel;
    }

    const [jobs, departments] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          department: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      prisma.department.findMany({
        include: {
          _count: {
            select: { jobs: { where: { status: "PUBLISHED" } } },
          },
        },
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      jobs,
      departments,
    });
  } catch (error: any) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
