import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await prisma.clientProject.findMany({
      where: { isPublic: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    console.error("GET /api/client-projects error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch client projects" }, { status: 500 });
  }
}
