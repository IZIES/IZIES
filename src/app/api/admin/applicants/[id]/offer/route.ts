import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { sendStageNotificationEmail, queueStageNotificationEmail } from "@/lib/email";
import { generateOfferRef } from "@/lib/offer-letter";

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
    const body = await req.json();

    const {
      offerSalary,
      offerJoiningDate,
      offerLocation,
      offerTerms,
      offerProbation,
      offerWorkingHours,
      offerNoticePeriod,
      offerSignatory,
      sendEmail = false,
      emailDispatchMode = "QUEUE", // "QUEUE" | "IMMEDIATE" | "NONE"
      customNote,
      markAsHired = true,
      forceResend = false,
    } = body;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: { department: true },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    const previousStatus = application.status;
    const newStatus = markAsHired ? "HIRED" : application.status;
    const now = new Date();
    const refNo = application.offerRefNo || generateOfferRef(application.id);
    const statusChanged = previousStatus !== newStatus;

    const [updated] = await prisma.$transaction([
      prisma.application.update({
        where: { id },
        data: {
          status: newStatus,
          offerSalary: offerSalary ?? application.offerSalary,
          offerJoiningDate: offerJoiningDate ?? application.offerJoiningDate,
          offerLocation: offerLocation ?? application.offerLocation,
          offerTerms: offerTerms ?? application.offerTerms,
          offerProbation: offerProbation ?? application.offerProbation,
          offerWorkingHours: offerWorkingHours ?? application.offerWorkingHours,
          offerNoticePeriod: offerNoticePeriod ?? application.offerNoticePeriod,
          offerSignatory: offerSignatory ?? application.offerSignatory,
          offerRefNo: refNo,
          offerSentAt: application.offerSentAt || now,
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
                reason: "Offer letter updated/issued by hiring leadership.",
              },
            }),
          ]
        : []),
    ]);

    let emailResult: any = null;
    const shouldSend = sendEmail && emailDispatchMode !== "NONE";

    if (shouldSend) {
      const emailParams = {
        applicationId: id,
        stage: "HIRED" as any,
        customNote: customNote || offerTerms || undefined,
        offerSalary: updated.offerSalary || undefined,
        offerJoiningDate: updated.offerJoiningDate || undefined,
        offerLocation: updated.offerLocation || undefined,
        offerTerms: updated.offerTerms || undefined,
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

    let message = "Offer letter saved in database.";
    if (alreadyExists) {
      message = "Offer letter updated in database. (Offer email was already sent/queued previously).";
    } else if (isQueued) {
      message = "Offer letter saved and added to Pending Outbox Queue for batch dispatch.";
    } else if (emailResult?.deliveryStatus === "SENT") {
      message = "Offer letter saved and dispatched immediately to candidate.";
    }

    return NextResponse.json({
      success: true,
      message,
      application: updated,
      emailSent: Boolean(emailResult?.success && !emailResult?.isQueued && !alreadyExists),
      emailQueued: isQueued && !alreadyExists,
      emailAlreadyExists: alreadyExists,
      emailRecord: emailResult?.email || null,
    });
  } catch (error: any) {
    console.error("POST /api/admin/applicants/[id]/offer error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update offer letter in database" },
      { status: 500 }
    );
  }
}
