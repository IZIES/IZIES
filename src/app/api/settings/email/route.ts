import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await prisma.systemSetting.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      return NextResponse.json({ success: true, settings: null });
    }

    // Never send the password back to the client
    const { smtpPass, ...safeSettings } = settings;
    return NextResponse.json({ 
      success: true, 
      settings: {
        ...safeSettings,
        hasPassword: !!smtpPass
      }
    });
  } catch (error: any) {
    console.error("GET /api/settings/email error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch email settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // If password is not provided but other fields are, keep existing password
    const existing = await prisma.systemSetting.findUnique({ where: { id: "default" } });
    const finalPass = body.smtpPass ? body.smtpPass.trim() : existing?.smtpPass;

    const updated = await prisma.systemSetting.upsert({
      where: { id: "default" },
      update: {
        smtpHost: body.smtpHost?.trim() || null,
        smtpPort: body.smtpPort ? parseInt(body.smtpPort, 10) : null,
        smtpUser: body.smtpUser?.trim() || null,
        smtpPass: finalPass || null,
        fromEmail: body.fromEmail?.trim() || null,
      },
      create: {
        id: "default",
        smtpHost: body.smtpHost?.trim() || null,
        smtpPort: body.smtpPort ? parseInt(body.smtpPort, 10) : null,
        smtpUser: body.smtpUser?.trim() || null,
        smtpPass: finalPass || null,
        fromEmail: body.fromEmail?.trim() || null,
      },
    });

    const { smtpPass, ...safeSettings } = updated;
    return NextResponse.json({ 
      success: true, 
      settings: {
        ...safeSettings,
        hasPassword: !!smtpPass
      } 
    });
  } catch (error: any) {
    console.error("PUT /api/settings/email error:", error);
    return NextResponse.json({ success: false, error: "Failed to update email settings" }, { status: 500 });
  }
}

// POST endpoint to test connection
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    let pass = body.smtpPass?.trim();
    
    // If no new password provided, try to use the saved one
    if (!pass) {
      const existing = await prisma.systemSetting.findUnique({ where: { id: "default" } });
      pass = existing?.smtpPass;
    }

    if (!body.smtpHost || !body.smtpPort || !body.smtpUser || !pass) {
      return NextResponse.json({ success: false, error: "Missing required SMTP credentials for testing" }, { status: 400 });
    }

    const port = parseInt(body.smtpPort, 10);
    const transporter = nodemailer.createTransport({
      host: body.smtpHost.trim(),
      port: port,
      secure: port === 465,
      auth: {
        user: body.smtpUser.trim(),
        pass: pass,
      },
      connectionTimeout: 10000, // 10 seconds
    });

    // Verify connection
    await transporter.verify();

    return NextResponse.json({ success: true, message: "SMTP connection successful!" });
  } catch (error: any) {
    console.error("POST /api/settings/email test error:", error);
    return NextResponse.json({ success: false, error: `Connection failed: ${error.message}` }, { status: 400 });
  }
}
