import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { jobSchema } from "@/lib/validations/job.schema";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        department: { select: { id: true, name: true } },
        _count: { select: { applications: true } },
      },
    });

    const departments = await prisma.department.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, jobs, departments });
  } catch (error: any) {
    console.error("GET /api/admin/jobs error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = jobSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message },
        { status: 400 }
      );
    }

    const data = parsed.data;
    let baseSlug = slugify(data.title);
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await prisma.job.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const job = await prisma.job.create({
      data: {
        title: data.title,
        slug,
        departmentId: data.departmentId,
        location: data.location,
        workplaceType: data.workplaceType,
        employmentType: data.employmentType,
        experienceLevel: data.experienceLevel,
        salaryRange: data.salaryRange || null,
        imageUrl: data.imageUrl || null,
        skills: data.skills || [],
        aboutRole: data.aboutRole,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        niceToHave: data.niceToHave,
        benefits: data.benefits,
        hiringProcess: data.hiringProcess,
        status: data.status,
        deadline: data.deadline ? new Date(data.deadline) : null,
      },
    });

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/jobs error:", error);
    return NextResponse.json({ success: false, error: "Failed to create job" }, { status: 500 });
  }
}
