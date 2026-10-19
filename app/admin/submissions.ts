// Compartilhado entre a página (servidor, Admin SDK) e o AdminPanel (cliente,
// tempo real). Não pode ficar num arquivo "use client": o servidor receberia
// referências de cliente em vez dos valores.

export const MAX_ROWS = 500;

export type Submission = {
  id: string;
  createdAt: string | null;
  name: string;
  phone: string;
  email: string;
  instagram: string;
  revenue: string;
  traffic: string;
  objective: string;
};

type DocLike = {
  id: string;
  data(): Record<string, unknown> & { createdAt?: { toDate(): Date } | null };
};

const str = (v: unknown) => (typeof v === "string" ? v : "");

export function toSubmission(doc: DocLike): Submission {
  const d = doc.data();
  return {
    id: doc.id,
    createdAt: d.createdAt?.toDate().toISOString() ?? null,
    name: str(d.name),
    phone: str(d.phone),
    email: str(d.email),
    instagram: str(d.instagram),
    revenue: str(d.revenue),
    traffic: str(d.traffic),
    objective: str(d.objective),
  };
}
