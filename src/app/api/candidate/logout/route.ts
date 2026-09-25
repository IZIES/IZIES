import { NextResponse } from "next/server";
import { CANDIDATE_COOKIE } from "@/lib/candidate-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete(CANDIDATE_COOKIE);
  return response;
}
