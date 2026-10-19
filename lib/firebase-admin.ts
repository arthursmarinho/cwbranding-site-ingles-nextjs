// Firebase Admin SDK — SOMENTE servidor (Server Actions, Route Handlers, Proxy).
// Ignora as Security Rules, por isso nunca pode ser importado no cliente:
// o `server-only` faz o build falhar se isso acontecer.
import "server-only";
// Não importar "firebase-admin/auth" aqui: ele puxa dependências ESM que exigem
// Node >= 22.12 e quebrariam o formulário. O Auth do admin fica em módulo próprio.
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente ausente: ${name}`);
  return value;
}

export function getAdminApp() {
  if (getApps().length) return getApp();

  return initializeApp({
    credential: cert({
      projectId: requireEnv("FIREBASE_PROJECT_ID"),
      clientEmail: requireEnv("FIREBASE_CLIENT_EMAIL"),
      // No .env/Vercel a chave fica numa linha só, com "\n" literais.
      privateKey: requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
  });
}

export const adminDb = () => getFirestore(getAdminApp());
