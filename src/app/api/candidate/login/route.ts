import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCandidatePassword, signCandidateToken, CANDIDATE_COOKIE } from "@/lib/candidate-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const candidate = await prisma.candidate.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!candidate) {
      return NextResponse.json(
        { success: false, error: "Account not found with this email" },
        { status: 401 }
      );
    }

    const isValid = await verifyCandidatePassword(password, candidate.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

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
        degree: candidate.degree,
        graduationYear: candidate.graduationYear,
        resumeUrl: candidate.resumeUrl,
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
    console.error("POST /api/candidate/login error:", error);
    return NextResponse.json(
      { success: false, error: "Candidate login failed" },
      { status: 500 }
    );
  }
}
