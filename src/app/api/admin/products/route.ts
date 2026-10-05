import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.iziesProduct.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, tagline, description, type, status, url, imageUrl, iconName, color, tags, services, isFeatured, order, isPublic } = body;

    if (!name || !tagline || !description) {
      return NextResponse.json({ success: false, error: "Name, tagline, and description are required" }, { status: 400 });
    }

    const product = await prisma.iziesProduct.create({
      data: {
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        type: type?.trim() || "Free",
        status: status || "in_development",
        url: url?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        iconName: iconName?.trim() || null,
        color: color || "indigo",
        tags: tags || [],
        services: services || [],
        isFeatured: isFeatured ?? false,
        order: order ? parseInt(order, 10) : 0,
        isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}
