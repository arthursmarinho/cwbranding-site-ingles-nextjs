"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { createAdminSession } from "./actions";

const ERRORS: Record<string, string> = {
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/invalid-email": "E-mail inválido.",
  "auth/user-disabled": "Este usuário está desativado.",
  "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos.",
  "auth/network-request-failed": "Sem conexão. Verifique sua internet.",
  forbidden: "Este e-mail não tem acesso ao painel.",
  server: "Não foi possível entrar agora. Tente novamente.",
};

const fieldClass =
  "h-[42px] w-full rounded-xl border border-white/10 bg-[#003533]/70 px-4 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-[#E8C39E]/70";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const [{ auth }, { signInWithEmailAndPassword, signOut }] = await Promise.all([
        import("@/lib/firebase"),
        import("firebase/auth"),
      ]);
      const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
      const result = await createAdminSession(await user.getIdToken());

      if (!result.ok) {
        await signOut(auth);
        setError(ERRORS[result.error]);
        return;
      }
      router.refresh();
    } catch (err) {
      const code = (err as { code?: string }).code ?? "server";
      setError(ERRORS[code] ?? ERRORS.server);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top_left,#0A4B48_0%,#04302E_55%,#032826_100%)] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-white/10 bg-[#0A3F3D]/70 p-6 shadow-2xl shadow-black/20 sm:p-8"
      >
        <div className="flex flex-col items-center text-center">
          <Lock className="size-8 text-[#E8C39E]" strokeWidth={1.5} />
          <h1 className="mt-4 font-display text-3xl text-white">Painel</h1>
        </div>

        <div>
          <label
            htmlFor="admin-email"
            className="mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-white/85"
          >
            E-mail
          </label>
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-white/85"
          >
            Senha
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="h-10 w-full rounded-full bg-[#0E6B67] text-xs font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-[#12807A] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
