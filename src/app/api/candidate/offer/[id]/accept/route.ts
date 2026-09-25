import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.offerAcceptedAt) {
      return NextResponse.json({
        success: true,
        message: "Offer is already accepted",
        acceptedAt: application.offerAcceptedAt,
      });
    }

    let signatureName = application.fullName;
    try {
      const body = await req.json();
      if (body?.signatureName) {
        signatureName = body.signatureName.trim();
      }
    } catch {
      // Body may be empty, fallback to fullName
    }

    const now = new Date();
    const updated = await prisma.application.update({
      where: { id },
      data: {
        offerAcceptedAt: now,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Offer letter accepted and digitally executed successfully!",
      acceptedAt: now,
      signatureName,
    });
  } catch (error: any) {
    console.error("POST /api/candidate/offer/[id]/accept error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to accept offer" },
      { status: 500 }
    );
  }
}
