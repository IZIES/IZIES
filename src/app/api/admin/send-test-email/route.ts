import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma, ApplicationStatus } from "@/lib/prisma";
import { getStageTemplateFromDb } from "@/lib/template-store";
import { renderStageEmail } from "@/lib/email-templates";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { stage, testEmail, customNote } = await req.json();

    if (!testEmail || !testEmail.includes("@")) {
      return NextResponse.json({ success: false, error: "A valid test email address is required" }, { status: 400 });
    }

    const targetStage = (stage || "APPLIED") as ApplicationStatus;

    // Fetch template from DB or default
    const dbTemplate = await getStageTemplateFromDb(targetStage);

    // Mock candidate data for testing
    const sampleData = {
      candidateName: "Test Applicant (Rahul Sharma)",
      candidateEmail: testEmail,
      candidatePhone: "+91 98765 43210",
      jobTitle: "Senior Full-Stack Engineer",
      departmentName: "Core Systems & AI Architecture",
      collegeName: "IIT Delhi",
      graduationYear: 2025,
      stage: targetStage,
      customNote: customNote || "This is a sample test note injected by admin to preview email layout.",
      applicationId: "test-app-123",
      appUrl:
        process.env.NEXT_PUBLIC_APP_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://izies.in"),
      offerSalary: "Unpaid (Experience & Certificate of Completion)",
      offerJoiningDate: "1st October 2026",
      offerLocation: "Remote (India)",
      offerTerms: "1-on-1 Engineering Mentorship, Official Experience Certificate, Milestone-based LOR, and Fast-Track PPO Evaluation.",
      meetingLink: dbTemplate.meetingLink || "https://meet.google.com/izies-pairing-demo",
      meetingTime: dbTemplate.meetingTime || "Friday, 12th October 2026 at 3:00 PM IST",
    };

    const rendered = renderStageEmail(sampleData);
    const subject = `[TEST] ${rendered.subject}`;

    // Get SMTP settings from system settings DB
    const settings = await prisma.systemSetting.findUnique({ where: { id: "default" } });
    const smtpHost = settings?.smtpHost || process.env.SMTP_HOST;
    const smtpPort = settings?.smtpPort || parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = settings?.smtpUser || process.env.SMTP_USER;
    const smtpPass = settings?.smtpPass || process.env.SMTP_PASS;
    const fromEmail = settings?.fromEmail || process.env.EMAIL_FROM || '"IZIES" <hr.izies@gmail.com>';

    let dispatchStatus = "SIMULATED";
    let statusMessage = "";

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
          to: testEmail,
          subject,
          text: rendered.text,
          html: rendered.html,
        });

        dispatchStatus = "SENT";
        statusMessage = `✓ Test email dispatched successfully to ${testEmail} via SMTP!`;
      } catch (smtpErr: any) {
        console.error("Test email SMTP error:", smtpErr);
        dispatchStatus = "FAILED";
        statusMessage = `SMTP Failed: ${smtpErr.message || "Could not deliver email"}`;
      }
    } else {
      statusMessage = `✓ Test email simulated for ${testEmail}. (Configure SMTP credentials in Settings to send real emails to your inbox).`;
    }

    // Record test email in database for audit logs if an application exists
    const firstApp = await prisma.application.findFirst({ select: { id: true } });
    let logRecord = null;
    if (firstApp) {
      logRecord = await prisma.emailNotification.create({
        data: {
          applicationId: firstApp.id,
          recipient: testEmail,
          stage: targetStage,
          subject,
          bodyText: rendered.text,
          bodyHtml: rendered.html,
          status: dispatchStatus,
        },
      }).catch((err) => {
        console.error("Test email log record creation error:", err);
        return null;
      });
    }

    return NextResponse.json({
      success: dispatchStatus !== "FAILED",
      status: dispatchStatus,
      message: statusMessage,
      emailRecord: logRecord,
      rendered,
    });
  } catch (error: any) {
    console.error("POST /api/admin/send-test-email error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to send test email" }, { status: 500 });
  }
}
