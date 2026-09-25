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
    const skills = await prisma.skill.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, skills });
  } catch (error: any) {
    console.error("GET /api/admin/skills error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, category } = await req.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Skill name is required" },
        { status: 400 }
      );
    }

    const cleanName = name.trim();

    // Check if skill already exists (case-insensitive)
    const existing = await prisma.skill.findFirst({
      where: {
        name: { equals: cleanName, mode: "insensitive" },
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        skill: existing,
        message: "Skill already exists.",
      });
    }

    const skill = await prisma.skill.create({
      data: {
        name: cleanName,
        category: category?.trim() || "Core",
      },
    });

    return NextResponse.json({
      success: true,
      skill,
      message: `Skill "${cleanName}" created successfully!`,
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/skills error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create skill" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Skill ID is required" }, { status: 400 });
    }

    await prisma.skill.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Skill removed" });
  } catch (error: any) {
    console.error("DELETE /api/admin/skills error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete skill" },
      { status: 500 }
    );
  }
}
