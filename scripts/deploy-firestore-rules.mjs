// Publica firestore.rules no projeto usando as credenciais do .env.local.
// Uso: node scripts/deploy-firestore-rules.mjs
import { readFileSync } from "node:fs";
import nextEnv from "@next/env";
import { cert, initializeApp } from "firebase-admin/app";
import { getSecurityRules } from "firebase-admin/security-rules";

nextEnv.loadEnvConfig(process.cwd());

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const ruleset = await getSecurityRules().releaseFirestoreRulesetFromSource(
  readFileSync("firestore.rules"),
);
console.log(`Regras publicadas: ${ruleset.name} (${ruleset.createTime})`);
