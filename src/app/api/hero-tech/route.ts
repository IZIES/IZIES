import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const domains = await prisma.heroTechDomain.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, domains });
  } catch (error: any) {
    console.error("GET /api/hero-tech error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch hero tech domains" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, shortTitle, slug, icon, color, position, description, technologies, order, isActive } = body;

    if (!title || !shortTitle) {
      return NextResponse.json(
        { success: false, error: "Title and shortTitle are required" },
        { status: 400 }
      );
    }

    const generatedSlug = (slug || shortTitle || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const domain = await prisma.heroTechDomain.create({
      data: {
        title: title.trim(),
        shortTitle: shortTitle.trim(),
        slug: generatedSlug,
        icon: icon || "Brain",
        color: color || "purple",
        position: position || "top",
        description: description?.trim() || null,
        technologies: Array.isArray(technologies) ? technologies.map((t: string) => t.trim()).filter(Boolean) : [],
        order: order ? parseInt(order, 10) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ success: true, domain }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/hero-tech error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create tech domain" }, { status: 500 });
  }
}
