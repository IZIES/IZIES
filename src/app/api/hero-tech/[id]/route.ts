import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

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

    const domain = await prisma.heroTechDomain.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title.trim() }),
        ...(body.shortTitle && { shortTitle: body.shortTitle.trim() }),
        ...(body.slug && {
          slug: body.slug
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
        }),
        ...(body.icon && { icon: body.icon }),
        ...(body.color && { color: body.color }),
        ...(body.position && { position: body.position }),
        ...(body.description !== undefined && { bio: body.description?.trim() || null }),
        ...(body.description !== undefined && { description: body.description?.trim() || null }),
        ...(body.technologies !== undefined && {
          technologies: Array.isArray(body.technologies)
            ? body.technologies.map((t: string) => t.trim()).filter(Boolean)
            : [],
        }),
        ...(body.order !== undefined && { order: parseInt(body.order, 10) }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      },
    });

    return NextResponse.json({ success: true, domain });
  } catch (error: any) {
    console.error("PATCH /api/hero-tech/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update tech domain" }, { status: 500 });
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
    await prisma.heroTechDomain.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Tech domain deleted" });
  } catch (error: any) {
    console.error("DELETE /api/hero-tech/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete tech domain" }, { status: 500 });
  }
}
