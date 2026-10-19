"use server";

import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_MS,
  getAdminAuth,
  isAllowedAdmin,
  verifyAdminSession,
} from "@/lib/admin-session";

export type LoginResult = { ok: true } | { ok: false; error: "forbidden" | "server" };

// Recebe o ID token do login feito no navegador e cria o session cookie.
export async function createAdminSession(idToken: string): Promise<LoginResult> {
  try {
    const auth = await getAdminAuth();
    const decoded = await auth.verifyIdToken(idToken, true);

    if (!isAllowedAdmin(decoded.email)) return { ok: false, error: "forbidden" };

    // Só aceita login recente (recomendação do Firebase para session cookies).
    if (Date.now() / 1000 - decoded.auth_time > 5 * 60) return { ok: false, error: "server" };

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: ADMIN_SESSION_MAX_AGE_MS,
    });

    (await cookies()).set(ADMIN_SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE_MS / 1000,
    });

    return { ok: true };
  } catch (error) {
    console.error("[admin] falha no login:", error);
    return { ok: false, error: "server" };
  }
}

// Token para o navegador ler contact_submissions em tempo real.
// A claim `admin` é o que firestore.rules exige; só sai daqui com sessão válida.
export async function getRealtimeToken(): Promise<string | null> {
  const session = await verifyAdminSession();
  if (!session) return null;
  try {
    return await (await getAdminAuth()).createCustomToken(session.uid, { admin: true });
  } catch (error) {
    console.error("[admin] falha ao gerar token de tempo real:", error);
    return null;
  }
}

export async function logoutAdmin() {
  const session = await verifyAdminSession();
  if (session) {
    // Invalida o cookie em qualquer dispositivo, não só neste navegador.
    await (await getAdminAuth()).revokeRefreshTokens(session.uid).catch(() => {});
  }
  (await cookies()).delete(ADMIN_SESSION_COOKIE);
}
