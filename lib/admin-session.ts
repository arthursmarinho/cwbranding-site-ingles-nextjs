// Sessão do painel admin — SOMENTE servidor.
// Fluxo: navegador faz login no Firebase Auth → envia o ID token → servidor
// troca por um session cookie httpOnly. Toda página/ação do admin chama
// verifyAdminSession(), que valida o cookie e a lista ADMIN_EMAILS.
import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { getAdminApp } from "./firebase-admin";

export const ADMIN_SESSION_COOKIE = "__session";
export const ADMIN_SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000; // 5 dias

// Import dinâmico: firebase-admin/auth exige Node >= 22.12 (ver lib/firebase-admin.ts).
export async function getAdminAuth() {
  const { getAuth } = await import("firebase-admin/auth");
  return getAuth(getAdminApp());
}

export function isAllowedAdmin(email: string | undefined) {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

export type AdminSession = { uid: string; email: string };

export const verifyAdminSession = cache(async (): Promise<AdminSession | null> => {
  const cookie = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!cookie) return null;

  try {
    // checkRevoked: logout (revokeRefreshTokens) invalida o cookie na hora.
    const decoded = await (await getAdminAuth()).verifySessionCookie(cookie, true);
    if (!isAllowedAdmin(decoded.email)) return null;
    return { uid: decoded.uid, email: decoded.email! };
  } catch {
    return null;
  }
});
