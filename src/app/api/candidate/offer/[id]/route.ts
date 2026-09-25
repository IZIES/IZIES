import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
          include: {
            department: true,
          },
        },
        candidate: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Offer letter not found" },
        { status: 404 }
      );
    }

    // Access Control: Admin can view ANY offer.
    // Candidate can ONLY view THEIR OWN offer.
    const admin = await getCurrentAdmin();
    const candidate = await getCurrentCandidate();

    const isAuthorizedAdmin = Boolean(admin);
    const isAuthorizedCandidate = Boolean(
      candidate &&
      (candidate.id === application.candidateId ||
       candidate.email.toLowerCase() === application.email.toLowerCase())
    );

    if (!isAuthorizedAdmin && !isAuthorizedCandidate) {
      return NextResponse.json(
        {
          success: false,
          error: "Access Denied: You are not authorized to view or download this Offer Letter.",
        },
        { status: 403 }
      );
    }

    const { getMasterOfferSettingsFromDb } = await import("@/lib/template-store");
    const masterSettings = await getMasterOfferSettingsFromDb();

    return NextResponse.json({
      success: true,
      application,
      masterSettings,
    });
  } catch (error: any) {
    console.error("GET /api/candidate/offer/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch offer details" },
      { status: 500 }
    );
  }
}

