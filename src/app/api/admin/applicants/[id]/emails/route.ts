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

    const emails = await prisma.emailNotification.findMany({
      where: { applicationId: id },
      orderBy: { sentAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      emails,
    });
  } catch (error: any) {
    console.error("GET /api/admin/applicants/[id]/emails error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch emails" }, { status: 500 });
  }
}
