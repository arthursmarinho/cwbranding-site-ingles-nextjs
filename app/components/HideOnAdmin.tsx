"use client";

import { useSelectedLayoutSegment } from "next/navigation";

// Esconde partes do site (Header/Footer) dentro do painel admin.
// Usa o segmento da rota (e não a URL), então funciona com o endereço secreto.
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  return useSelectedLayoutSegment() === "admin" ? null : children;
}
