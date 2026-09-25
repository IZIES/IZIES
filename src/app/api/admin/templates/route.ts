import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import {
  getAllStageTemplatesFromDb,
  getStageTemplateFromDb,
  saveStageTemplateToDb,
  resetStageTemplateInDb,
} from "@/lib/template-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage");

  if (stage) {
    const template = await getStageTemplateFromDb(stage.toUpperCase());
    return NextResponse.json({ success: true, template });
  }

  const templates = await getAllStageTemplatesFromDb();
  return NextResponse.json({ success: true, templates });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { stage, action, config } = body;

    if (!stage) {
      return NextResponse.json({ success: false, error: "Stage is required" }, { status: 400 });
    }

    if (action === "reset") {
      const resetTpl = await resetStageTemplateInDb(stage.toUpperCase());
      return NextResponse.json({
        success: true,
        message: `Template for ${stage} reset to system default in database`,
        template: resetTpl,
      });
    }

    const updated = await saveStageTemplateToDb(stage.toUpperCase(), config);
    return NextResponse.json({
      success: true,
      message: `Template for ${stage} saved in database successfully`,
      template: updated,
    });
  } catch (err: any) {
    console.error("POST /api/admin/templates error:", err);
    return NextResponse.json({ success: false, error: "Failed to save template in database" }, { status: 500 });
  }
}
