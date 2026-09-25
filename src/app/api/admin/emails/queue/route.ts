import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { batchDispatchQueuedEmails, deleteQueuedEmails } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const queue = await prisma.emailNotification.findMany({
      where: { status: "QUEUED" },
      orderBy: { sentAt: "desc" },
      include: {
        application: {
          include: {
            job: {
              include: { department: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      queue,
      count: queue.length,
    });
  } catch (error: any) {
    console.error("GET /api/admin/emails/queue error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch queued emails" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action = "send", emailIds } = body;

    if (action === "send") {
      const result = await batchDispatchQueuedEmails(emailIds);
      return NextResponse.json({
        success: true,
        message: `Successfully dispatched ${result.sentCount} email(s) from outbox queue!`,
        result,
      });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/admin/emails/queue error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process outbox queue" },
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
    const body = await req.json();
    const { emailIds } = body;

    if (!Array.isArray(emailIds) || emailIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Array of emailIds required" },
        { status: 400 }
      );
    }

    const result = await deleteQueuedEmails(emailIds);
    return NextResponse.json({
      success: true,
      message: `Cancelled and removed ${result.deletedCount} email(s) from outbox queue.`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/emails/queue error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete queued emails" },
      { status: 500 }
    );
  }
}
