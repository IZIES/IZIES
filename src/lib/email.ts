import nodemailer from "nodemailer";
import { prisma, ApplicationStatus } from "@/lib/prisma";
import { renderStageEmail, EmailTemplateData } from "@/lib/email-templates";

interface StageEmailParams {
  applicationId: string;
  stage: ApplicationStatus;
  customNote?: string;
  customSubject?: string;
  offerSalary?: string;
  offerJoiningDate?: string;
  offerLocation?: string;
  offerTerms?: string;
  forceResend?: boolean;
}

/**
 * Prepares and renders stage email data for an application
 */
async function prepareStageEmail(params: StageEmailParams) {
  const {
    applicationId,
    stage,
    customNote,
    customSubject,
    offerSalary,
    offerJoiningDate,
    offerLocation,
    offerTerms,
  } = params;

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        include: {
          department: true,
        },
      },
      candidate: true,
    },
  });

  if (!application) {
    throw new Error(`Application ${applicationId} not found`);
  }

  const templateData: EmailTemplateData = {
    candidateName: application.fullName,
    candidateEmail: application.email,
    candidatePhone: application.phone,
    jobTitle: application.job.title,
    departmentName: application.job.department?.name,
    collegeName: application.collegeName || application.candidate?.collegeName || undefined,
    graduationYear:
      application.graduationYear || application.candidate?.graduationYear || undefined,
    stage: stage as string,
    customNote,
    applicationId: application.id,
    appUrl:
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://izies-career.vercel.app"),
    offerSalary: offerSalary || application.offerSalary || undefined,
    offerJoiningDate: offerJoiningDate || application.offerJoiningDate || undefined,
    offerLocation: offerLocation || application.offerLocation || undefined,
    offerTerms: offerTerms || application.offerTerms || undefined,
  };

  const rendered = renderStageEmail(templateData);
  const finalSubject = customSubject?.trim() || rendered.subject;

  return {
    application,
    rendered,
    finalSubject,
  };
}

/**
 * Sends an email directly over SMTP or local simulator
 */
async function sendRawEmail(to: string, fullName: string, subject: string, text: string, html: string, roleTitle: string, stage: string) {
  const settings = await prisma.systemSetting.findUnique({ where: { id: "default" } });
  
  const smtpHost = settings?.smtpHost || process.env.SMTP_HOST;
  const smtpPort = settings?.smtpPort || parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = settings?.smtpUser || process.env.SMTP_USER;
  const smtpPass = settings?.smtpPass || process.env.SMTP_PASS;
  const fromEmail = settings?.fromEmail || process.env.EMAIL_FROM || '"IZIES" <hr.izies@gmail.com>';

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: fromEmail,
        to,
        subject,
        text,
        html,
      });

      console.log(`[EMAIL DISPATCHED] Stage: ${stage} -> Sent to ${to}`);
      return "SENT";
    } catch (smtpErr) {
      console.error(`[SMTP ERROR] Failed sending to ${to}:`, smtpErr);
      return "FAILED";
    }
  }

  // Development / sandbox simulator mode
  console.log("\n=======================================================");
  console.log(`📨 [IZIES ATS EMAIL DISPATCH] Stage: ${stage}`);
  console.log(`To: ${fullName} <${to}>`);
  console.log(`Subject: ${subject}`);
  console.log(`Role: ${roleTitle}`);
  console.log(`Status: Successfully recorded & logged (Simulation Mode)`);
  console.log("=======================================================\n");

  return "SIMULATED";
}

/**
 * 1. QUEUE STAGE NOTIFICATION EMAIL (Outbox Queue Mode)
 * Adds the rendered email to the database with status = 'QUEUED' so recruiter can review and batch send later.
 */
export async function queueStageNotificationEmail(params: StageEmailParams) {
  try {
    // 1. Deduplication check: Do not re-queue if already QUEUED or SENT for this stage
    if (!params.forceResend) {
      const existingEmail = await prisma.emailNotification.findFirst({
        where: {
          applicationId: params.applicationId,
          stage: params.stage,
          status: { in: ["QUEUED", "SENT", "SIMULATED"] },
        },
        orderBy: { sentAt: "desc" },
      });

      if (existingEmail) {
        console.log(
          `[DEDUPLICATION PREVENTED] Stage email already exists in Outbox for application: ${params.applicationId} stage: ${params.stage}`
        );
        return {
          success: true,
          email: existingEmail,
          deliveryStatus: existingEmail.status,
          subject: existingEmail.subject,
          isQueued: existingEmail.status === "QUEUED",
          alreadyExists: true,
        };
      }
    }

    const { application, rendered, finalSubject } = await prepareStageEmail(params);

    // Create record in email_notifications with status 'QUEUED'
    const emailRecord = await prisma.emailNotification.create({
      data: {
        applicationId: application.id,
        recipient: application.email,
        stage: params.stage,
        subject: finalSubject,
        bodyText: rendered.text,
        bodyHtml: rendered.html,
        status: "QUEUED",
      },
      include: {
        application: {
          include: { job: true },
        },
      },
    });

    console.log(`[EMAIL QUEUED IN OUTBOX] Stage: ${params.stage} for candidate: ${application.fullName} <${application.email}>`);

    return {
      success: true,
      email: emailRecord,
      deliveryStatus: "QUEUED",
      subject: finalSubject,
      isQueued: true,
      alreadyExists: false,
    };
  } catch (error: any) {
    console.error("[queueStageNotificationEmail error]:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 2. SEND STAGE NOTIFICATION EMAIL IMMEDIATELY
 */
export async function sendStageNotificationEmail(params: StageEmailParams) {
  try {
    // 1. Deduplication check: Do not re-send if already SENT/SIMULATED for this stage
    if (!params.forceResend) {
      const existingEmail = await prisma.emailNotification.findFirst({
        where: {
          applicationId: params.applicationId,
          stage: params.stage,
          status: { in: ["SENT", "SIMULATED"] },
        },
        orderBy: { sentAt: "desc" },
      });

      if (existingEmail) {
        console.log(
          `[DEDUPLICATION PREVENTED] Stage email was already sent to application: ${params.applicationId} stage: ${params.stage}`
        );
        return {
          success: true,
          email: existingEmail,
          deliveryStatus: existingEmail.status,
          subject: existingEmail.subject,
          isQueued: false,
          alreadyExists: true,
        };
      }
    }

    const { application, rendered, finalSubject } = await prepareStageEmail(params);

    const deliveryStatus = await sendRawEmail(
      application.email,
      application.fullName,
      finalSubject,
      rendered.text,
      rendered.html,
      application.job.title,
      params.stage
    );

    const emailRecord = await prisma.emailNotification.create({
      data: {
        applicationId: application.id,
        recipient: application.email,
        stage: params.stage,
        subject: finalSubject,
        bodyText: rendered.text,
        bodyHtml: rendered.html,
        status: deliveryStatus,
      },
      include: {
        application: {
          include: { job: true },
        },
      },
    });

    return {
      success: true,
      email: emailRecord,
      deliveryStatus,
      subject: finalSubject,
      isQueued: false,
      alreadyExists: false,
    };
  } catch (error: any) {
    console.error("[sendStageNotificationEmail error]:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * 3. DISPATCH A SINGLE QUEUED EMAIL
 */
export async function dispatchSingleQueuedEmail(emailId: string) {
  const emailItem = await prisma.emailNotification.findUnique({
    where: { id: emailId },
    include: {
      application: {
        include: { job: true },
      },
    },
  });

  if (!emailItem) {
    throw new Error(`Queued email ${emailId} not found`);
  }

  if (emailItem.status !== "QUEUED") {
    return { success: true, alreadySent: true, email: emailItem };
  }

  const deliveryStatus = await sendRawEmail(
    emailItem.recipient,
    emailItem.application?.fullName || "Candidate",
    emailItem.subject,
    emailItem.bodyText,
    emailItem.bodyHtml,
    emailItem.application?.job?.title || "Role",
    emailItem.stage
  );

  const updated = await prisma.emailNotification.update({
    where: { id: emailId },
    data: {
      status: deliveryStatus,
      sentAt: new Date(),
    },
  });

  return {
    success: true,
    email: updated,
    deliveryStatus,
  };
}

/**
 * 4. BATCH DISPATCH ALL OR SELECTED QUEUED EMAILS
 */
export async function batchDispatchQueuedEmails(emailIds?: string[]) {
  const whereClause: any = { status: "QUEUED" };
  if (emailIds && emailIds.length > 0) {
    whereClause.id = { in: emailIds };
  }

  const queuedEmails = await prisma.emailNotification.findMany({
    where: whereClause,
    include: {
      application: {
        include: { job: true },
      },
    },
  });

  let sentCount = 0;
  let failedCount = 0;

  for (const item of queuedEmails) {
    try {
      const deliveryStatus = await sendRawEmail(
        item.recipient,
        item.application?.fullName || "Candidate",
        item.subject,
        item.bodyText,
        item.bodyHtml,
        item.application?.job?.title || "Role",
        item.stage
      );

      await prisma.emailNotification.update({
        where: { id: item.id },
        data: {
          status: deliveryStatus,
          sentAt: new Date(),
        },
      });

      sentCount++;
    } catch (err) {
      console.error(`Failed to dispatch queued email ${item.id}:`, err);
      failedCount++;
    }
  }

  return {
    success: true,
    totalQueuedFound: queuedEmails.length,
    sentCount,
    failedCount,
  };
}

/**
 * 5. CANCEL / DELETE QUEUED EMAILS FROM OUTBOX
 */
export async function deleteQueuedEmails(emailIds: string[]) {
  const deleted = await prisma.emailNotification.deleteMany({
    where: {
      id: { in: emailIds },
      status: "QUEUED",
    },
  });

  return {
    success: true,
    deletedCount: deleted.count,
  };
}
