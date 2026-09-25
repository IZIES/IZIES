import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, error: "Note content is required" }, { status: 400 });
    }

    const note = await prisma.applicationNote.create({
      data: {
        applicationId: id,
        authorId: admin.userId,
        content: content.trim(),
      },
      include: {
        author: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, note });
  } catch (error: any) {
    console.error("POST /api/admin/applicants/[id]/notes error:", error);
    return NextResponse.json({ success: false, error: "Failed to add note" }, { status: 500 });
  }
}
