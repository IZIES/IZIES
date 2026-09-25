import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const CANDIDATE_JWT_SECRET = process.env.JWT_SECRET || "izies_candidate_jwt_secret_2026";
const CANDIDATE_COOKIE_NAME = "izies_candidate_token";

export interface CandidatePayload {
  candidateId: string;
  email: string;
  fullName: string;
}

export async function hashCandidatePassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyCandidatePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signCandidateToken(payload: CandidatePayload): string {
  return jwt.sign(payload, CANDIDATE_JWT_SECRET, { expiresIn: "30d" });
}

export function verifyCandidateToken(token: string): CandidatePayload | null {
  try {
    return jwt.verify(token, CANDIDATE_JWT_SECRET) as CandidatePayload;
  } catch {
    return null;
  }
}

export async function getCurrentCandidate() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(CANDIDATE_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyCandidateToken(token);
    if (!payload) return null;

    const candidate = await prisma.candidate.findUnique({
      where: { id: payload.candidateId },
      select: {
        id: true,
        email: true,
        fullName: true,
        headline: true,
        avatarUrl: true,
        location: true,
        phone: true,
        collegeName: true,
        degree: true,
        branch: true,
        graduationYear: true,
        cgpa: true,
        currentYear: true,
        resumeUrl: true,
        skills: true,
        projects: true,
        linkedInUrl: true,
        githubUrl: true,
        portfolioUrl: true,
        twitterUrl: true,
        bio: true,
      },
    });

    return candidate;
  } catch (err) {
    console.error("getCurrentCandidate error:", err);
    return null;
  }
}

export const CANDIDATE_COOKIE = CANDIDATE_COOKIE_NAME;
