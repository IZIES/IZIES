import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { renderStageEmail } from "@/lib/email-templates";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      applicationId,
      candidateName = "Candidate",
      jobTitle = "Software Engineer",
      departmentName = "Engineering",
      collegeName,
      graduationYear,
      stage = "FIRST_CALL",
      customNote,
      offerSalary,
      offerJoiningDate,
      offerLocation,
      offerTerms,
    } = await req.json();

    const rendered = renderStageEmail({
      applicationId,
      candidateName,
      jobTitle,
      departmentName,
      collegeName,
      graduationYear,
      stage,
      customNote,
      offerSalary,
      offerJoiningDate,
      offerLocation,
      offerTerms,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005",
    });

    return NextResponse.json({
      success: true,
      preview: rendered,
    });
  } catch (error: any) {
    console.error("POST /api/admin/email-preview error:", error);
    return NextResponse.json({ success: false, error: "Failed to render preview" }, { status: 500 });
  }
}
