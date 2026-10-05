import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await prisma.clientProject.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, clientName, industry, description, challenge, solution, result, techStack, services, imageUrl, websiteUrl, startDate, endDate, isFeatured, order, isPublic } = body;

    if (!name || !clientName || !industry || !description) {
      return NextResponse.json({ success: false, error: "Name, clientName, industry, and description are required" }, { status: 400 });
    }

    const project = await prisma.clientProject.create({
      data: {
        name: name.trim(),
        clientName: clientName.trim(),
        industry: industry.trim(),
        description: description.trim(),
        challenge: challenge?.trim() || null,
        solution: solution?.trim() || null,
        result: result?.trim() || null,
        techStack: techStack || [],
        services: services || [],
        imageUrl: imageUrl?.trim() || null,
        websiteUrl: websiteUrl?.trim() || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isFeatured: isFeatured ?? false,
        order: order ? parseInt(order, 10) : 0,
        isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
      },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/client-projects error:", error);
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 });
  }
}
