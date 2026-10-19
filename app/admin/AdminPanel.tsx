"use client";

import { useEffect, useRef, useState } from "react";
import { translations } from "../utils/translations";
import { formatPhone } from "../utils/contactForm";
import { getRealtimeToken } from "./actions";
import { MAX_ROWS, toSubmission, type Submission } from "./submissions";

type LiveStatus = "connecting" | "live" | "offline";

const t = translations.PT;

const dateParts = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/Sao_Paulo",
});

// Montado à mão para servidor e navegador gerarem exatamente o mesmo texto.
function formatDate(iso: string | null) {
  if (!iso) return "—";
  const p = Object.fromEntries(
    dateParts.formatToParts(new Date(iso)).map((part) => [part.type, part.value]),
  );
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
}

const Empty = () => <span className="text-white/30">—</span>;

function InstagramOrSite({ value }: { value: string }) {
  if (!value) return <Empty />;
  const href = value.startsWith("@")
    ? `https://instagram.com/${value.slice(1)}`
    : /^https?:\/\//i.test(value)
      ? value
      : null;
  if (!href) return <>{value}</>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="text-[#E8C39E] hover:underline"
    >
      {value}
    </a>
  );
}

const STATUS_LABEL: Record<LiveStatus, string> = {
  connecting: "Conectando...",
  live: "Ao vivo",
  offline: "Tempo real indisponível — atualize a página",
};

const STATUS_DOT: Record<LiveStatus, string> = {
  connecting: "bg-yellow-400",
  live: "bg-emerald-400 animate-pulse",
  offline: "bg-red-400",
};

export function AdminPanel({ email, initial }: { email: string; initial: Submission[] }) {
  const [rows, setRows] = useState(initial);
  const [status, setStatus] = useState<LiveStatus>("connecting");
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const knownIds = useRef(new Set(initial.map((s) => s.id)));

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    (async () => {
      try {
        const token = await getRealtimeToken();
        if (!token) throw new Error("sem token");

        const [{ auth, db }, { signInWithCustomToken }, fs] = await Promise.all([
          import("@/lib/firebase"),
          import("firebase/auth"),
          import("firebase/firestore"),
        ]);
        await signInWithCustomToken(auth, token);
        if (cancelled) return;

        const q = fs.query(
          fs.collection(db, "contact_submissions"),
          fs.orderBy("createdAt", "desc"),
          fs.limit(MAX_ROWS),
        );

        unsubscribe = fs.onSnapshot(
          q,
          (snap) => {
            const next: Submission[] = snap.docs.map(toSubmission);

            const arrived = next.filter((s) => !knownIds.current.has(s.id)).map((s) => s.id);
            arrived.forEach((id) => knownIds.current.add(id));
            if (arrived.length) setNewIds((prev) => new Set([...prev, ...arrived]));

            setRows(next);
            setStatus("live");
          },
          (error) => {
            // No logout o Firebase desconecta antes do painel desmontar: não é erro.
            if (!auth.currentUser) return;
            console.error("[admin] tempo real:", error);
            setStatus("offline");
          },
        );
      } catch (error) {
        console.error("[admin] tempo real:", error);
        if (!cancelled) setStatus("offline");
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#032826] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display text-3xl md:text-4xl">
              Contatos <span className="text-[#E8C39E]">recebidos</span>
            </h1>
            <p className="mt-1 text-sm text-white/60">
              {rows.length} {rows.length === 1 ? "envio" : "envios"}
              {rows.length === MAX_ROWS && ` (mostrando os ${MAX_ROWS} mais recentes)`}
              {" · "}
              {email}
            </p>
            <p
              role="status"
              data-live-status={status}
              className="mt-2 inline-flex items-center gap-2 text-xs text-white/70"
            >
              <span className={`size-2 rounded-full ${STATUS_DOT[status]}`} />
              {STATUS_LABEL[status]}
            </p>
          </div>
        </header>

        {rows.length === 0 ? (
          <p className="py-20 text-center text-white/60">Nenhum contato recebido ainda.</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-white/70">
                <tr>
                  {[
                    "Data",
                    "Nome",
                    "WhatsApp",
                    "E-mail",
                    "Instagram / site",
                    "Faturamento",
                    "Tráfego pago",
                    "Objetivo",
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {rows.map((s) => {
                  const isNew = newIds.has(s.id);
                  return (
                    <tr
                      key={s.id}
                      data-new={isNew || undefined}
                      className={`align-top transition-colors ${
                        isNew ? "bg-[#E8C39E]/10" : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-white/70">
                        {formatDate(s.createdAt)}
                        {isNew && (
                          <span className="ml-2 rounded-full bg-[#E8C39E] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#004D4C]">
                            Novo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <a
                          href={`tel:+55${s.phone}`}
                          className="text-[#E8C39E] hover:underline"
                        >
                          {formatPhone(s.phone)}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        {s.email ? (
                          <a href={`mailto:${s.email}`} className="hover:underline">
                            {s.email}
                          </a>
                        ) : (
                          <Empty />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <InstagramOrSite value={s.instagram} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {t.contactRevenueOptions[s.revenue as keyof typeof t.contactRevenueOptions] ?? (
                          <Empty />
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {t.contactTrafficOptions[s.traffic as keyof typeof t.contactTrafficOptions] ?? (
                          <Empty />
                        )}
                      </td>
                      <td className="max-w-md whitespace-pre-wrap break-words px-4 py-3 text-white/85">
                        {s.objective}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
