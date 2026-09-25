import { NextResponse } from "next/server";
import { BUSINESS_EMAIL } from "@/lib/business";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, companyName, service, budget, description, source } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required." },
        { status: 400 }
      );
    }

    // 1. Persist inquiry into PostgreSQL database
    const inquiry = await prisma.contactInquiry.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        companyName: companyName?.trim() || null,
        service: service?.trim() || "AI Solution",
        budget: budget?.trim() || null,
        description: description?.trim() || null,
        source: source || "website_contact",
        status: "NEW",
      },
    });

    console.log(`[INBOUND LEAD RECEIVED] ID: ${inquiry.id} | From: ${fullName} <${email}> | Service: ${service}`);

    // 2. Dispatch internal email notification to Founders / Admin if SMTP configured
    try {
      const settings = await prisma.systemSetting.findUnique({ where: { id: "default" } });
      const smtpHost = settings?.smtpHost || process.env.SMTP_HOST;
      const smtpPort = settings?.smtpPort || parseInt(process.env.SMTP_PORT || "587");
      const smtpUser = settings?.smtpUser || process.env.SMTP_USER;
      const smtpPass = settings?.smtpPass || process.env.SMTP_PASS;
      const fromEmail = settings?.fromEmail || process.env.EMAIL_FROM || '"IZIES" <hr.izies@gmail.com>';
      const notifyEmail = settings?.contactEmail || process.env.ADMIN_NOTIFY_EMAIL || BUSINESS_EMAIL;

      if (smtpHost && smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: fromEmail,
          to: notifyEmail,
          subject: `🚨 New Project Inquiry: ${fullName} (${companyName || "Direct Client"}) — ${service || "Digital Project"}`,
          html: `
            <div style="font-family: sans-serif; background: #070A11; color: #e2e8f0; padding: 28px; border-radius: 16px;">
              <h2 style="color: #a855f7; margin-top: 0;">New Inbound Client Lead Received</h2>
              <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 18px; border-radius: 12px; margin: 16px 0;">
                <p><strong>Client Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #60a5fa;">${email}</a></p>
                <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
                <p><strong>Company:</strong> ${companyName || "Not provided"}</p>
                <p><strong>Service Requested:</strong> <span style="background: #3b82f6; color: white; padding: 2px 8px; border-radius: 6px; font-size: 12px;">${service || "AI Solution"}</span></p>
                ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ""}
                <p><strong>Project Requirements:</strong></p>
                <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #cbd5e1;">
                  ${description ? description.replace(/\n/g, "<br/>") : "No description provided."}
                </div>
              </div>
              <p style="font-size: 12px; color: #94a3b8;">Manage and update status in your Founder Command Center / Admin Portal.</p>
            </div>
          `,
        });
      }
    } catch (mailErr) {
      console.error("Failed to send internal inquiry notification email:", mailErr);
    }

    return NextResponse.json({
      success: true,
      inquiryId: inquiry.id,
      message: "Your project inquiry has been received! Our team will review the details and follow up.",
    });
  } catch (error: any) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
