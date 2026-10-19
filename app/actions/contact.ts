"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import type { Firestore } from "firebase-admin/firestore";
import {
  CONTACT_FIELDS,
  HONEYPOT_FIELD,
  onlyDigits,
  validateContact,
  type ContactFormState,
  type ContactValues,
} from "../utils/contactForm";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

async function getClientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
}

// Máx. RATE_LIMIT_MAX envios por IP na janela. Guarda só o hash do IP (LGPD).
async function isRateLimited(
  db: Firestore,
  Timestamp: typeof import("firebase-admin/firestore").Timestamp,
  ip: string,
) {
  const ref = db
    .collection("rate_limits")
    .doc(createHash("sha256").update(ip).digest("hex"));

  return db.runTransaction(async (tx) => {
    const now = Date.now();
    const snap = await tx.get(ref);
    const hits = ((snap.get("hits") as InstanceType<typeof Timestamp>[] | undefined) ?? []).filter(
      (t) => now - t.toMillis() < RATE_LIMIT_WINDOW_MS,
    );
    if (hits.length >= RATE_LIMIT_MAX) return true;
    tx.set(ref, { hits: [...hits, Timestamp.fromMillis(now)] });
    return false;
  });
}

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Bot preencheu o campo invisível: finge sucesso e descarta.
  if (formData.get(HONEYPOT_FIELD)) return { status: "success" };

  const values = Object.fromEntries(
    CONTACT_FIELDS.map((field) => [field, String(formData.get(field) ?? "").trim()]),
  ) as ContactValues;

  const fieldErrors = validateContact(values);
  if (Object.keys(fieldErrors).length) {
    return { status: "error", reason: "validation", fieldErrors };
  }

  try {
    // Import dinâmico: se o Firebase falhar ao carregar, cai no catch e o
    // visitante vê a mensagem de erro do formulário, não a tela de erro do Next.
    const [{ adminDb }, { FieldValue, Timestamp }] = await Promise.all([
      import("@/lib/firebase-admin"),
      import("firebase-admin/firestore"),
    ]);
    const db = adminDb();

    if (await isRateLimited(db, Timestamp, await getClientIp())) {
      return { status: "error", reason: "rateLimit" };
    }

    await db.collection("contact_submissions").add({
      ...values,
      phone: onlyDigits(values.phone),
      email: values.email.toLowerCase(),
      language: "EN",
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
    });

    return { status: "success" };
  } catch (error) {
    console.error("[contact] falha ao salvar envio:", error);
    return { status: "error", reason: "server" };
  }
}
