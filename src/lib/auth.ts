import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "izies_careers_jwt_secret_dev_2026";
const COOKIE_NAME = "izies_admin_token";

export interface AdminPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<AdminPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyAdminToken(token);
    if (!payload) return null;

    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, role: true, name: true, isActive: true },
      });

      if (user) {
        if (!user.isActive) return null;
        return {
          userId: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        };
      }
    } catch (dbErr) {
      console.warn("Database query in getCurrentAdmin fallback to JWT:", dbErr);
    }

    // Fallback to verified cryptographically-signed JWT payload
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role || "SUPER_ADMIN",
      name: payload.name || "Admin",
    };
  } catch (err) {
    console.error("getCurrentAdmin error:", err);
    return null;
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
