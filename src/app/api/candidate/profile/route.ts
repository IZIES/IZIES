import { NextRequest, NextResponse } from "next/server";
import { getCurrentCandidate } from "@/lib/candidate-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const current = await getCurrentCandidate();
  if (!current) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await prisma.candidate.update({
      where: { id: current.id },
      data: {
        ...(body.fullName && { fullName: body.fullName.trim() }),
        ...(body.headline !== undefined && { headline: body.headline?.trim() || null }),
        ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl?.trim() || null }),
        ...(body.location !== undefined && { location: body.location?.trim() || null }),
        ...(body.phone !== undefined && { phone: body.phone?.trim() || null }),
        ...(body.collegeName !== undefined && { collegeName: body.collegeName?.trim() || null }),
        ...(body.degree !== undefined && { degree: body.degree?.trim() || null }),
        ...(body.branch !== undefined && { branch: body.branch?.trim() || null }),
        ...(body.graduationYear !== undefined && {
          graduationYear: body.graduationYear ? parseInt(body.graduationYear, 10) : null,
        }),
        ...(body.cgpa !== undefined && { cgpa: body.cgpa?.trim() || null }),
        ...(body.currentYear !== undefined && { currentYear: body.currentYear?.trim() || null }),
        ...(body.resumeUrl !== undefined && { resumeUrl: body.resumeUrl?.trim() || null }),
        ...(body.skills !== undefined && { skills: Array.isArray(body.skills) ? body.skills : [] }),
        ...(body.projects !== undefined && { projects: body.projects }),
        ...(body.linkedInUrl !== undefined && { linkedInUrl: body.linkedInUrl?.trim() || null }),
        ...(body.githubUrl !== undefined && { githubUrl: body.githubUrl?.trim() || null }),
        ...(body.portfolioUrl !== undefined && { portfolioUrl: body.portfolioUrl?.trim() || null }),
        ...(body.twitterUrl !== undefined && { twitterUrl: body.twitterUrl?.trim() || null }),
        ...(body.bio !== undefined && { bio: body.bio?.trim() || null }),
      },
    });

    return NextResponse.json({ success: true, candidate: updated });
  } catch (error: any) {
    console.error("PATCH /api/candidate/profile error:", error);
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}
