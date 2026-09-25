import { NextResponse } from "next/server";
import { getCurrentCandidate } from "@/lib/candidate-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const candidate = await getCurrentCandidate();
  if (!candidate) {
    return NextResponse.json({ success: false, candidate: null });
  }

  // Also fetch all applications submitted by this candidate
  const applications = await prisma.application.findMany({
    where: {
      OR: [
        { candidateId: candidate.id },
        { email: candidate.email },
      ],
    },
    orderBy: { createdAt: "desc" },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            location: true,
            employmentType: true,
            department: { select: { name: true } },
          },
        },
        emails: {
          orderBy: { sentAt: "desc" },
        },
      },
    });

  return NextResponse.json({
    success: true,
    candidate,
    applications,
  });
}
