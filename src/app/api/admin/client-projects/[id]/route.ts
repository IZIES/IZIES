import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const project = await prisma.clientProject.update({
      where: { id: params.id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.clientName !== undefined && { clientName: body.clientName.trim() }),
        ...(body.industry !== undefined && { industry: body.industry.trim() }),
        ...(body.description !== undefined && { description: body.description.trim() }),
        ...(body.challenge !== undefined && { challenge: body.challenge?.trim() || null }),
        ...(body.solution !== undefined && { solution: body.solution?.trim() || null }),
        ...(body.result !== undefined && { result: body.result?.trim() || null }),
        ...(body.techStack !== undefined && { techStack: body.techStack }),
        ...(body.services !== undefined && { services: body.services }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl?.trim() || null }),
        ...(body.websiteUrl !== undefined && { websiteUrl: body.websiteUrl?.trim() || null }),
        ...(body.startDate !== undefined && { startDate: body.startDate ? new Date(body.startDate) : null }),
        ...(body.endDate !== undefined && { endDate: body.endDate ? new Date(body.endDate) : null }),
        ...(body.isFeatured !== undefined && { isFeatured: Boolean(body.isFeatured) }),
        ...(body.order !== undefined && { order: parseInt(body.order, 10) }),
        ...(body.isPublic !== undefined && { isPublic: Boolean(body.isPublic) }),
      },
    });
    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.clientProject.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 });
  }
}
