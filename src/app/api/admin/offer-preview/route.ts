import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { renderOfferLetterHtml } from "@/lib/offer-letter";
import { getMasterOfferSettingsFromDb } from "@/lib/template-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const masterSettings = body.masterSettings || (await getMasterOfferSettingsFromDb());

    const letterHtml = renderOfferLetterHtml({
      applicationId: "SAMPLE-PREVIEW-001",
      candidateName: "Rahul Sharma",
      candidateEmail: "rahul.sharma@example.com",
      candidatePhone: "+91 98765 43210",
      collegeName: "IIT Delhi",
      degree: "B.Tech Computer Science",
      jobTitle: "Senior Full-Stack Engineer",
      departmentName: "Core Engineering & Systems",
      employmentType: masterSettings.defaultEmploymentType || "Full-Time Executive",
      workplaceType: masterSettings.defaultLocation || "Remote (India)",
      offerSalary: masterSettings.defaultSalary || "₹18,00,000 / Year",
      offerJoiningDate: masterSettings.defaultJoiningDate || "October 1, 2026",
      offerLocation: masterSettings.defaultLocation || "Remote (India)",
      offerTerms: masterSettings.defaultSpecialTerms || "Performance Bonuses + ESOP Pool Inclusion + Health Coverage",
      probationPeriod: masterSettings.defaultProbation || "3 Months Evaluation",
      workingHours: masterSettings.defaultWorkingHours || "40 Hours / Week",
      noticePeriod: masterSettings.defaultNoticePeriod || "30 Days Written Notice",
      signatoryName: masterSettings.defaultSignatory || "Managing Director & CEO",
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005",
      isAccepted: false,
      masterSettings,
    });

    const printableHtml = letterHtml.replace(
      "</body>",
      `<script>window.addEventListener('DOMContentLoaded', () => { setTimeout(() => window.print(), 500); });</script></body>`
    );

    return new NextResponse(printableHtml, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("POST /api/admin/offer-preview error:", error);
    return new NextResponse("Failed to generate preview", { status: 500 });
  }
}

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const masterSettings = await getMasterOfferSettingsFromDb();

    const letterHtml = renderOfferLetterHtml({
      applicationId: "SAMPLE-PREVIEW-001",
      candidateName: "Rahul Sharma",
      candidateEmail: "rahul.sharma@example.com",
      candidatePhone: "+91 98765 43210",
      collegeName: "IIT Delhi",
      degree: "B.Tech Computer Science",
      jobTitle: "Senior Full-Stack Engineer",
      departmentName: "Core Engineering & Systems",
      employmentType: masterSettings.defaultEmploymentType || "Full-Time Executive",
      workplaceType: masterSettings.defaultLocation || "Remote (India)",
      offerSalary: masterSettings.defaultSalary || "₹18,00,000 / Year",
      offerJoiningDate: masterSettings.defaultJoiningDate || "October 1, 2026",
      offerLocation: masterSettings.defaultLocation || "Remote (India)",
      offerTerms: masterSettings.defaultSpecialTerms || "Performance Bonuses + ESOP Pool Inclusion + Health Coverage",
      probationPeriod: masterSettings.defaultProbation || "3 Months Evaluation",
      workingHours: masterSettings.defaultWorkingHours || "40 Hours / Week",
      noticePeriod: masterSettings.defaultNoticePeriod || "30 Days Written Notice",
      signatoryName: masterSettings.defaultSignatory || "Managing Director & CEO",
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005",
      isAccepted: false,
      masterSettings,
    });

    const printableHtml = letterHtml.replace(
      "</body>",
      `<script>window.addEventListener('DOMContentLoaded', () => { setTimeout(() => window.print(), 500); });</script></body>`
    );

    return new NextResponse(printableHtml, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("GET /api/admin/offer-preview error:", error);
    return new NextResponse("Failed to generate preview", { status: 500 });
  }
}
