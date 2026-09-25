import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { formatImageUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: { createdAt: "asc" },
    });

    const formattedTeamMembers = teamMembers.map((m) => ({
      ...m,
      avatarUrl: formatImageUrl(m.avatarUrl),
    }));

    return NextResponse.json({ success: true, teamMembers: formattedTeamMembers });
  } catch (error: any) {
    console.error("GET /api/team error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch team members" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, role, department, avatarUrl, bio, linkedInUrl, twitterUrl, githubUrl, order, isPublic } = body;

    if (!name || !role || !avatarUrl) {
      return NextResponse.json(
        { success: false, error: "Name, role, and avatar photo URL are required" },
        { status: 400 }
      );
    }

    const member = await prisma.teamMember.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        department: department?.trim() || "Core Team",
        avatarUrl: formatImageUrl(avatarUrl.trim()),
        bio: bio?.trim() || null,
        linkedInUrl: linkedInUrl?.trim() || null,
        twitterUrl: twitterUrl?.trim() || null,
        githubUrl: githubUrl?.trim() || null,
        order: order ? parseInt(order, 10) : 0,
        isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
      },
    });

    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/team error:", error);
    return NextResponse.json({ success: false, error: "Failed to add team member" }, { status: 500 });
  }
}
