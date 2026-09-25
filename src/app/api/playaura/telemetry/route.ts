import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Gracefully accept telemetry heartbeats from developer tools/extensions
    return NextResponse.json({
      success: true,
      status: "acknowledged",
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "healthy", service: "playaura-telemetry" });
}
