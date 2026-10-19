// Rota interna. O acesso público é só pelo endereço secreto (ADMIN_PATH),
// reescrito para cá pelo proxy.ts; /admin direto responde 404.
import type { Metadata } from "next";
import { verifyAdminSession } from "@/lib/admin-session";
import { adminDb } from "@/lib/firebase-admin";
import { getAllPosts } from "@/lib/posts";
import { AdminPanel } from "./AdminPanel";
import { AdminTabs } from "./AdminTabs";
import { BlogManager } from "./BlogManager";
import { LoginForm } from "./LoginForm";
import { MAX_ROWS, toSubmission, type Submission } from "./submissions";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false, nocache: true },
};

// Lista inicial renderizada no servidor; o AdminPanel assume em tempo real.
async function getSubmissions(): Promise<Submission[]> {
  const snap = await adminDb()
    .collection("contact_submissions")
    .orderBy("createdAt", "desc")
    .limit(MAX_ROWS)
    .get();

  return snap.docs.map(toSubmission);
}

export default async function AdminPage() {
  const session = await verifyAdminSession();
  if (!session) return <LoginForm />;

  const [submissions, posts] = await Promise.all([getSubmissions(), getAllPosts()]);

  return (
    <AdminTabs
      leads={<AdminPanel email={session.email} initial={submissions} />}
      blog={<BlogManager posts={posts} />}
    />
  );
}
