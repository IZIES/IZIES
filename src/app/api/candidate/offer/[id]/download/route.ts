import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderOfferLetterHtml } from "@/lib/offer-letter";
import { getMasterOfferSettingsFromDb } from "@/lib/template-store";
import { getCurrentAdmin } from "@/lib/auth";
import { getCurrentCandidate } from "@/lib/candidate-auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: { department: true },
        },
      },
    });

    if (!application) {
      return new NextResponse("Application not found", { status: 404 });
    }

    // Access Control: Admin can view/download ANY offer.
    // Candidate can ONLY view/download THEIR OWN offer.
    const admin = await getCurrentAdmin();
    const candidate = await getCurrentCandidate();

    const isAuthorizedAdmin = Boolean(admin);
    const isAuthorizedCandidate = Boolean(
      candidate &&
      (candidate.id === application.candidateId ||
       candidate.email.toLowerCase() === application.email.toLowerCase())
    );

    if (!isAuthorizedAdmin && !isAuthorizedCandidate) {
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>403 Forbidden — Access Denied</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #06080F; color: #F87171; display: flex; height: 100vh; align-items: center; justify-content: center; text-align: center; margin: 0; padding: 20px;">
  <div style="background: #0D111D; border: 1px solid rgba(248, 113, 113, 0.3); padding: 40px; border-radius: 24px; max-width: 480px; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
    <div style="font-size: 48px; margin-bottom: 16px;">🔒</div>
    <h1 style="font-size: 20px; font-weight: 800; color: #FFFFFF; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 1px;">Access Denied — Confidential Document</h1>
    <p style="color: #94A3B8; font-size: 13px; line-height: 1.6; margin: 0 0 24px 0;">
      This Letter of Appointment is strictly confidential. You must be logged in as the designated candidate or an authorized company admin to view or download this document.
    </p>
    <a href="/candidate/login" style="display: inline-block; background: #2563EB; color: #FFFFFF; padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 700; text-decoration: none;">Candidate Login</a>
  </div>
</body>
</html>`,
        { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    const masterSettings = await getMasterOfferSettingsFromDb();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005";

    const letterHtml = renderOfferLetterHtml({
      applicationId: application.id,
      candidateName: application.fullName,
      candidateEmail: application.email,
      candidatePhone: application.phone,
      collegeName: application.collegeName || undefined,
      degree: application.degree || undefined,
      jobTitle: application.job?.title || "Role",
      departmentName: application.job?.department?.name || "Engineering",
      offerSalary: application.offerSalary || masterSettings.defaultSalary,
      offerJoiningDate: application.offerJoiningDate || masterSettings.defaultJoiningDate,
      offerLocation: application.offerLocation || masterSettings.defaultLocation,
      offerTerms: application.offerTerms || masterSettings.defaultSpecialTerms,
      probationPeriod: application.offerProbation || masterSettings.defaultProbation,
      workingHours: application.offerWorkingHours || masterSettings.defaultWorkingHours,
      noticePeriod: application.offerNoticePeriod || masterSettings.defaultNoticePeriod,
      signatoryName: application.offerSignatory || masterSettings.defaultSignatory,
      appUrl,
      isAccepted: Boolean(application.offerAcceptedAt),
      acceptedAt: application.offerAcceptedAt || undefined,
      signatureName: application.offerSignatureName || application.fullName,
      masterSettings,
    });

    // Inject auto-print script
    const printableHtml = letterHtml.replace(
      "</body>",
      `<script>window.addEventListener('DOMContentLoaded', () => { setTimeout(() => window.print(), 600); });</script></body>`
    );

    return new NextResponse(printableHtml, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="Offer_Letter_${application.fullName.replace(/\s+/g, "_")}.html"`,
      },
    });
  } catch (error) {
    console.error("GET /api/candidate/offer/[id]/download error:", error);
    return new NextResponse("Failed to generate printable offer letter", { status: 500 });
  }
}

