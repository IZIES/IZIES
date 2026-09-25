import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import {
  getMasterOfferSettingsFromDb,
  saveMasterOfferSettingsToDb,
  resetMasterOfferSettingsInDb,
} from "@/lib/template-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getMasterOfferSettingsFromDb();
  return NextResponse.json({ success: true, settings });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, settings } = body;

    if (action === "reset") {
      const resetSet = await resetMasterOfferSettingsInDb();
      return NextResponse.json({
        success: true,
        message: "Master offer settings reset to system default in database",
        settings: resetSet,
      });
    }

    const updated = await saveMasterOfferSettingsToDb(settings);
    return NextResponse.json({
      success: true,
      message: "Master offer letter settings and rules saved in database successfully",
      settings: updated,
    });
  } catch (err: any) {
    console.error("POST /api/admin/offer-settings error:", err);
    return NextResponse.json({ success: false, error: "Failed to save offer settings in database" }, { status: 500 });
  }
}
