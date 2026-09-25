import { NextRequest, NextResponse } from "next/server";
import { prisma, InquiryStatus } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const SYNC_SECRET = process.env.IZIES_SYNC_SECRET || "izies_premiumfree_sync_secret_2026";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  const secretParam = req.nextUrl.searchParams.get("secret");
  const secretHeader = req.headers.get("x-sync-secret");
  const hasValidSecret = (secretParam === SYNC_SECRET) || (secretHeader === SYNC_SECRET);

  if (!hasValidSecret) {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const resolvedParams = await Promise.resolve(props.params);
    const { id } = resolvedParams;
    const body = await req.json();

    const updateData: any = {};
    if (body.status && Object.values(InquiryStatus).includes(body.status as InquiryStatus)) {
      updateData.status = body.status;
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes?.trim() || null;
    }

    const updated = await prisma.contactInquiry.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error: any) {
    console.error("PATCH /api/admin/inquiries/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  const secretParam = req.nextUrl.searchParams.get("secret");
  const secretHeader = req.headers.get("x-sync-secret");
  const hasValidSecret = (secretParam === SYNC_SECRET) || (secretHeader === SYNC_SECRET);

  if (!hasValidSecret) {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const resolvedParams = await Promise.resolve(props.params);
    const { id } = resolvedParams;
    await prisma.contactInquiry.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Inquiry deleted" });
  } catch (error: any) {
    console.error("DELETE /api/admin/inquiries/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to delete inquiry" }, { status: 500 });
  }
}
