import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ALLOWED_ORIGIN = "https://izies-work.vercel.app";

function getCorsHeaders(req?: NextRequest) {
  const reqOrigin = req?.headers.get("origin");
  let allowOrigin = ALLOWED_ORIGIN;

  if (reqOrigin && (reqOrigin.includes("izies") || reqOrigin.includes("playaura-work.vercel.app") || reqOrigin.includes("localhost"))) {
    allowOrigin = reqOrigin;
  }

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, secret",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders(req) });
}

// Public API endpoint for PremiumFree OS to fetch hired candidates
// GET /api/admin/applicants/hired?secret=izies_sync_secret_2026
export async function GET(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  // Simple shared secret auth for cross-app communication
  if (secret !== "izies_premiumfree_sync_secret_2026") {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401, headers: corsHeaders }
    );
  }

  try {
    const hiredApplicants = await prisma.application.findMany({
      where: {
        status: { in: ["HIRED", "SELECTED"] },
      },
      orderBy: { updatedAt: "desc" },
      include: {
        job: {
          select: { title: true, department: { select: { name: true } } },
        },
        candidate: {
          select: {
            fullName: true,
            email: true,
            phone: true,
            collegeName: true,
            degree: true,
            branch: true,
            graduationYear: true,
            skills: true,
            resumeUrl: true,
            linkedInUrl: true,
            githubUrl: true,
            portfolioUrl: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        hiredApplicants: hiredApplicants.map((app) => ({
          iziesApplicationId: app.id,
          fullName: app.fullName,
          email: app.email,
          phone: app.phone,
          appliedRole: app.job?.title || "Unknown",
          department: app.job?.department?.name || null,
          status: app.status,
          // Candidate profile data
          collegeName: app.candidate?.collegeName || app.collegeName,
          degree: app.candidate?.degree || app.degree,
          branch: app.candidate?.branch || app.branch,
          graduationYear: app.candidate?.graduationYear || app.graduationYear,
          skills: app.candidate?.skills || app.skills || [],
          resumeUrl: app.candidate?.resumeUrl || app.resumeUrl,
          linkedInUrl: app.candidate?.linkedInUrl || app.linkedInUrl,
          githubUrl: app.candidate?.githubUrl || app.githubUrl,
          portfolioUrl: app.candidate?.portfolioUrl || app.portfolioUrl,
          hiredAt: app.updatedAt,
        })),
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("GET /api/admin/applicants/hired error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hired applicants" },
      { status: 500, headers: corsHeaders }
    );
  }
}
