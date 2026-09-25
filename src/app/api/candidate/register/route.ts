import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashCandidatePassword, signCandidateToken, CANDIDATE_COOKIE } from "@/lib/candidate-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      password,
      phone,
      collegeName,
      degree,
      branch,
      graduationYear,
      cgpa,
      currentYear,
      resumeUrl,
      linkedInUrl,
      githubUrl,
      portfolioUrl,
    } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.candidate.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }

    const passwordHash = await hashCandidatePassword(password);

    const candidate = await prisma.candidate.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        phone: phone?.trim() || null,
        collegeName: collegeName?.trim() || null,
        degree: degree?.trim() || null,
        branch: branch?.trim() || null,
        graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
        cgpa: cgpa?.trim() || null,
        currentYear: currentYear?.trim() || null,
        resumeUrl: resumeUrl?.trim() || null,
        linkedInUrl: linkedInUrl?.trim() || null,
        githubUrl: githubUrl?.trim() || null,
        portfolioUrl: portfolioUrl?.trim() || null,
      },
    });

    const token = signCandidateToken({
      candidateId: candidate.id,
      email: candidate.email,
      fullName: candidate.fullName,
    });

    const response = NextResponse.json({
      success: true,
      candidate: {
        id: candidate.id,
        email: candidate.email,
        fullName: candidate.fullName,
        collegeName: candidate.collegeName,
        graduationYear: candidate.graduationYear,
      },
    });

    response.cookies.set({
      name: CANDIDATE_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error("POST /api/candidate/register error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register candidate account" },
      { status: 500 }
    );
  }
}
