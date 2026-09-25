import { NextRequest, NextResponse } from "next/server";
import { prisma, ApplicationStatus } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { sendStageNotificationEmail, queueStageNotificationEmail } from "@/lib/email";

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
    const {
      status,
      reason,
      firstCallNotes,
      sendEmail = true,
      emailDispatchMode = "QUEUE", // "QUEUE" | "IMMEDIATE" | "NONE"
      customNote,
      customSubject,
      offerSalary,
      offerJoiningDate,
      offerLocation,
      offerTerms,
      forceResend = false,
    } = await req.json();

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    const previousStatus = application.status;
    const newStatus = status as ApplicationStatus;
    const isHired = newStatus === "HIRED" || newStatus === "SELECTED";
    const statusChanged = previousStatus !== newStatus;

    // Execute atomic update
    const [updated] = await prisma.$transaction([
      prisma.application.update({
        where: { id },
        data: {
          status: newStatus,
          firstCallNotes: firstCallNotes !== undefined ? firstCallNotes : undefined,
          offerSalary: offerSalary || (isHired ? application.offerSalary : undefined),
          offerJoiningDate: offerJoiningDate || (isHired ? application.offerJoiningDate : undefined),
          offerLocation: offerLocation || (isHired ? application.offerLocation : undefined),
          offerTerms: offerTerms || (isHired ? application.offerTerms : undefined),
          offerSentAt: isHired ? (application.offerSentAt || new Date()) : undefined,
        },
      }),
      ...(statusChanged
        ? [
            prisma.applicationStatusHistory.create({
              data: {
                applicationId: id,
                previousStatus,
                newStatus,
                changedById: admin.userId,
                reason: reason || null,
              },
            }),
          ]
        : []),
    ]);

    // Handle Email: QUEUE vs IMMEDIATE vs NONE with deduplication
    let emailResult: any = null;
    const shouldSend = sendEmail && emailDispatchMode !== "NONE";

    if (shouldSend) {
      const emailParams = {
        applicationId: id,
        stage: newStatus,
        customNote: customNote || firstCallNotes || reason,
        customSubject,
        offerSalary: offerSalary || updated.offerSalary || undefined,
        offerJoiningDate: offerJoiningDate || updated.offerJoiningDate || undefined,
        offerLocation: offerLocation || updated.offerLocation || undefined,
        offerTerms: offerTerms || updated.offerTerms || undefined,
        forceResend,
      };

      if (emailDispatchMode === "IMMEDIATE") {
        emailResult = await sendStageNotificationEmail(emailParams);
      } else {
        // Default to QUEUE (Outbox Queue)
        emailResult = await queueStageNotificationEmail(emailParams);
      }
    }

    const isQueued = Boolean(emailResult?.isQueued);
    const alreadyExists = Boolean(emailResult?.alreadyExists);

    let responseMessage = `Status updated to ${newStatus}.`;
    if (alreadyExists) {
      responseMessage = `Status is ${newStatus}. (Notification for this stage was already created/sent previously).`;
    } else if (isQueued) {
      responseMessage = `Status updated to ${newStatus}. Stage email added to Pending Outbox Queue.`;
    } else if (emailResult?.deliveryStatus === "SENT") {
      responseMessage = `Status updated to ${newStatus}. Email dispatched to candidate.`;
    }

    return NextResponse.json({
      success: true,
      message: responseMessage,
      application: updated,
      emailSent: Boolean(emailResult?.success && !emailResult?.isQueued && !alreadyExists),
      emailQueued: isQueued && !alreadyExists,
      emailAlreadyExists: alreadyExists,
      emailRecord: emailResult?.email || null,
    });
  } catch (error: any) {
    console.error("PATCH /api/admin/applicants/[id]/status error:", error);
    return NextResponse.json({ success: false, error: "Failed to update status" }, { status: 500 });
  }
}
