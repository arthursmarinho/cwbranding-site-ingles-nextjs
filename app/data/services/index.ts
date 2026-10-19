// Lista de serviços da CWBranding. Para editar os textos de um serviço,
// abra o arquivo dele nesta pasta (ex.: seo.ts).
import type { Language } from "@/app/utils/translations";
import { agenciaDeBranding } from "./agencia-de-branding";
import { coberturaDeEventos } from "./cobertura-de-eventos";
import { ensaiosFotograficos } from "./ensaios-fotograficos";
import { gestaoDeTrafego } from "./gestao-de-trafego";
import { identidadeVisual } from "./identidade-visual";
import { landingPages } from "./landing-pages";
import { materiaisGraficos } from "./materiais-graficos";
import { seo } from "./seo";
import { sitesInstitucionais } from "./sites-institucionais";
import { socialMedia } from "./social-media";
import type { ServiceContent, ServiceText } from "./types";

export type { ServiceContent, ServiceText };

// A ordem aqui é a ordem dos cards na home.
export const services: ServiceContent[] = [
  socialMedia,
  identidadeVisual,
  gestaoDeTrafego,
  landingPages,
  agenciaDeBranding,
  ensaiosFotograficos,
  materiaisGraficos,
  coberturaDeEventos,
  seo,
  sitesInstitucionais,
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getServiceById(id: string | number) {
  return services.find((service) => String(service.id) === String(id));
}

export function getServicePath(service: Pick<ServiceContent, "slug">) {
  return `/services/${service.slug}`;
}

// Texto do serviço no idioma escolhido no site.
export function getServiceText(service: ServiceContent, language: Language): ServiceText {
  return language === "EN" ? service.en : service.pt;
}
