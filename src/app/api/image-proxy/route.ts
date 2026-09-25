import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getGoogleDriveDirectUrl(url: string): string {
  const fileIdMatch =
    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    url.match(/id=([a-zA-Z0-9_-]+)/) ||
    url.match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (fileIdMatch && fileIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
  }
  return url;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawUrl = searchParams.get("url");

    if (!rawUrl) {
      return new NextResponse("Missing url parameter", { status: 400 });
    }

    let targetUrl = rawUrl.trim();

    if (targetUrl.includes("drive.google.com") || targetUrl.includes("googleusercontent.com")) {
      targetUrl = getGoogleDriveDirectUrl(targetUrl);
    }

    const imageRes = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!imageRes.ok) {
      return new NextResponse("Failed to fetch image from upstream server", {
        status: imageRes.status,
      });
    }

    const contentType = imageRes.headers.get("content-type") || "image/jpeg";
    const imageBuffer = await imageRes.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error: any) {
    console.error("GET /api/image-proxy error:", error);
    return new NextResponse("Failed to proxy image", { status: 500 });
  }
}
