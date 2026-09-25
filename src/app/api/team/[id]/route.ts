import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { formatImageUrl } from "@/lib/utils";

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

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name.trim() }),
        ...(body.role && { role: body.role.trim() }),
        ...(body.department && { department: body.department.trim() }),
        ...(body.avatarUrl && { avatarUrl: formatImageUrl(body.avatarUrl.trim()) }),
        ...(body.bio !== undefined && { bio: body.bio?.trim() || null }),
        ...(body.linkedInUrl !== undefined && { linkedInUrl: body.linkedInUrl?.trim() || null }),
        ...(body.twitterUrl !== undefined && { twitterUrl: body.twitterUrl?.trim() || null }),
        ...(body.githubUrl !== undefined && { githubUrl: body.githubUrl?.trim() || null }),
        ...(body.order !== undefined && { order: parseInt(body.order, 10) }),
        ...(body.isPublic !== undefined && { isPublic: Boolean(body.isPublic) }),
      },
    });

    return NextResponse.json({ success: true, member });
  } catch (error: any) {
    console.error("PATCH /api/team/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update team member" }, { status: 500 });
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
    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Team member deleted" });
  } catch (error: any) {
    console.error("DELETE /api/team/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete team member" }, { status: 500 });
  }
}
