// Sites que a CWBranding já desenvolveu. Aparecem nas páginas de
// E-commerces (sites-institucionais) e Landing Pages, cada uma com o seu tipo.
//
// Para adicionar um projeto: rode `npm run capture:portfolio -- <url> <nome>`
// (aceita cookies antes do print) ou coloque .webp em public/portfolio/ e adicione um item aqui.

export type PortfolioType = "site" | "landing-page";

export type PortfolioProject = {
  name: string;
  url: string;
  type: PortfolioType;
  desktopImage: string; // print da versão para computador
  mobileImage: string; // print da versão para celular
};

export const portfolio: PortfolioProject[] = [
  {
    name: "Sensora Home",
    url: "https://www.sensorahome.com.br/",
    type: "site",
    desktopImage: "/portfolio/sensora-home-desktop.webp",
    mobileImage: "/portfolio/sensora-home-mobile.webp",
  },
  {
    name: "NanoSkinBio",
    url: "https://nanoskinbiobrasil.com.br/index.html",
    type: "landing-page",
    desktopImage: "/portfolio/nanoskinbio-desktop.webp",
    mobileImage: "/portfolio/nanoskinbio-mobile.webp",
  },
];

// Qual tipo de projeto aparece em cada página de serviço.
const TYPE_BY_SERVICE: Record<string, PortfolioType> = {
  "sites-institucionais": "site",
  "landing-pages": "landing-page",
};

// Projetos para mostrar na página de um serviço (lista vazia = a seção não aparece).
export function getPortfolioForService(serviceSlug: string): PortfolioProject[] {
  const type = TYPE_BY_SERVICE[serviceSlug];
  return portfolio.filter((project) => project.type === type);
}
