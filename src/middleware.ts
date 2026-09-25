import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isValidToken(token?: string): boolean {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    let base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    const payloadJson =
      typeof atob === "function"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8");
    const payload = JSON.parse(payloadJson);

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false; // Token expired
    }
    return true;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Admin Routes Guard
  if (pathname.startsWith("/admin")) {
    const adminToken = request.cookies.get("izies_admin_token")?.value;
    const isLoggedAdmin = isValidToken(adminToken);

    // If Admin is logged in and visits /admin/login -> redirect to /admin/dashboard
    if (pathname === "/admin/login") {
      if (isLoggedAdmin) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    } else {
      // For private admin routes, redirect to /admin/login if not logged in
      if (!isLoggedAdmin) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
  }

  // 2. Candidate/Student Routes Guard
  if (pathname.startsWith("/candidate")) {
    const candidateToken = request.cookies.get("izies_candidate_token")?.value;
    const isLoggedCandidate = isValidToken(candidateToken);

    const isCandidateAuthPage =
      pathname === "/candidate/login" || pathname === "/candidate/register";

    const isPublicOfferPage = pathname.startsWith("/candidate/offer");

    // Case A: If student IS LOGGED IN and tries to access /candidate/login or /candidate/register
    // -> Redirect them to /candidate/dashboard
    if (isCandidateAuthPage && isLoggedCandidate) {
      return NextResponse.redirect(new URL("/candidate/dashboard", request.url));
    }

    // Case B: If student is NOT LOGGED IN and tries to access private candidate routes (dashboard, profile, root /candidate)
    // -> Redirect them to /candidate/login
    if (!isCandidateAuthPage && !isPublicOfferPage && !isLoggedCandidate) {
      const loginUrl = new URL("/candidate/login", request.url);
      if (pathname !== "/candidate" && pathname !== "/candidate/dashboard") {
        loginUrl.searchParams.set("redirect", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/candidate/:path*"],
};
