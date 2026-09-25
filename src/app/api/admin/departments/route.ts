import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { jobs: true },
        },
      },
    });

    return NextResponse.json({ success: true, departments });
  } catch (error: any) {
    console.error("GET /api/admin/departments error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch departments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, icon } = await req.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Department name is required" },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    let baseSlug = slugify(cleanName);
    if (!baseSlug) baseSlug = "dept";

    // Check if department with exact name already exists (case-insensitive)
    const existing = await prisma.department.findFirst({
      where: {
        name: { equals: cleanName, mode: "insensitive" },
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        department: existing,
        message: "Department already exists.",
      });
    }

    let slug = baseSlug;
    let counter = 1;
    while (await prisma.department.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const department = await prisma.department.create({
      data: {
        name: cleanName,
        slug,
        description: description?.trim() || null,
        icon: icon?.trim() || "Briefcase",
      },
      include: {
        _count: {
          select: { jobs: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      department,
      message: `Department "${cleanName}" created successfully!`,
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/departments error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create department" },
      { status: 500 }
    );
  }
}
