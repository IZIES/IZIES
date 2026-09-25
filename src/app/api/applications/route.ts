import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentCandidate } from "@/lib/candidate-auth";
import { sendStageNotificationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const candidateSession = await getCurrentCandidate();

    let {
      jobId,
      fullName,
      email,
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
      coverLetter,
      relevantExperience,
      additionalInfo,
      consentGiven = true,
    } = body;

    // If candidate is logged in or candidateId passed, pull candidate's profile data
    let candidateRecord = null;
    const targetCandidateId = candidateSession?.id || body.candidateId;
    if (targetCandidateId) {
      candidateRecord = await prisma.candidate.findUnique({
        where: { id: targetCandidateId },
      });
      if (candidateRecord) {
        fullName = fullName || candidateRecord.fullName;
        email = email || candidateRecord.email;
        phone = phone || candidateRecord.phone;
        collegeName = collegeName || candidateRecord.collegeName;
        degree = degree || candidateRecord.degree;
        branch = branch || candidateRecord.branch;
        graduationYear = graduationYear || candidateRecord.graduationYear?.toString();
        cgpa = cgpa || candidateRecord.cgpa;
        currentYear = currentYear || candidateRecord.currentYear;
        resumeUrl = resumeUrl || candidateRecord.resumeUrl;
        linkedInUrl = linkedInUrl || candidateRecord.linkedInUrl;
        githubUrl = githubUrl || candidateRecord.githubUrl;
        portfolioUrl = portfolioUrl || candidateRecord.portfolioUrl;
      }
    }

    if (!jobId) {
      return NextResponse.json({ success: false, error: "Job ID is required" }, { status: 400 });
    }

    if (!candidateSession && !candidateRecord) {
      return NextResponse.json(
        { success: false, error: "Please log in to your student profile to apply for this role." },
        { status: 401 }
      );
    }

    if (!fullName || !email || !resumeUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Your profile is missing a resume link. Please add your resume/drive link in your profile before applying.",
        },
        { status: 400 }
      );
    }

    // 1. Verify Job Status
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, title: true, status: true, deadline: true },
    });

    if (!job || job.status !== "PUBLISHED") {
      return NextResponse.json(
        { success: false, error: "This position is no longer accepting applications." },
        { status: 400 }
      );
    }

    // 2. Prevent Duplicate Application
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await prisma.application.findUnique({
      where: {
        jobId_email: {
          jobId,
          email: normalizedEmail,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already applied for this position! You can track your application status in your Student Dashboard.",
        },
        { status: 409 }
      );
    }

    // 3. Link Candidate ID if logged in or find candidate by email
    let candidateId = candidateSession?.id || body.candidateId;
    if (!candidateId) {
      const existingCandidate = await prisma.candidate.findUnique({
        where: { email: normalizedEmail },
      });
      if (existingCandidate) {
        candidateId = existingCandidate.id;
      }
    }

    // 4. Create Application with College & Graduation Details
    const application = await prisma.application.create({
      data: {
        jobId,
        candidateId: candidateId || null,
        fullName: fullName.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        collegeName: collegeName?.trim() || null,
        degree: degree?.trim() || null,
        branch: branch?.trim() || null,
        graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
        cgpa: cgpa?.trim() || null,
        currentYear: currentYear?.trim() || null,
        resumeUrl: resumeUrl.trim(),
        linkedInUrl: linkedInUrl?.trim() || null,
        githubUrl: githubUrl?.trim() || null,
        portfolioUrl: portfolioUrl?.trim() || null,
        coverLetter: coverLetter?.trim() || null,
        relevantExperience: relevantExperience?.trim() || null,
        additionalInfo: additionalInfo?.trim() || null,
        consentGiven: Boolean(consentGiven),
        status: "APPLIED",
      },
    });

    // Automatically dispatch stage email for APPLIED
    try {
      await sendStageNotificationEmail({
        applicationId: application.id,
        stage: "APPLIED",
      });
    } catch (err) {
      console.error("Error dispatching APPLIED email:", err);
    }

    // 5. Update Candidate Profile if logged in
    if (candidateId) {
      await prisma.candidate.update({
        where: { id: candidateId },
        data: {
          phone: phone.trim(),
          collegeName: collegeName?.trim() || undefined,
          degree: degree?.trim() || undefined,
          branch: branch?.trim() || undefined,
          graduationYear: graduationYear ? parseInt(graduationYear, 10) : undefined,
          cgpa: cgpa?.trim() || undefined,
          currentYear: currentYear?.trim() || undefined,
          resumeUrl: resumeUrl.trim(),
          linkedInUrl: linkedInUrl?.trim() || undefined,
          githubUrl: githubUrl?.trim() || undefined,
          portfolioUrl: portfolioUrl?.trim() || undefined,
        },
      }).catch(() => {});
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully! Our team will review your profile.",
        applicationId: application.id,
        application,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit application. Please check your inputs and try again." },
      { status: 500 }
    );
  }
}
