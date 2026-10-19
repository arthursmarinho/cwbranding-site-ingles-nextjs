"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAdmin } from "./actions";

export function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await logoutAdmin();
          const [{ auth }, { signOut }] = await Promise.all([
            import("@/lib/firebase"),
            import("firebase/auth"),
          ]);
          await signOut(auth);
          router.refresh();
        })
      }
      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/85 transition-colors hover:border-[#E8C39E] hover:text-[#E8C39E] disabled:opacity-60"
    >
      <LogOut className="size-3.5" />
      {pending ? "Saindo..." : "Sair"}
    </button>
  );
}
