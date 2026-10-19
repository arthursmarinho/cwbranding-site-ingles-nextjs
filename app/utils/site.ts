import { contact } from "./contact";

export const site = {
  name: "CWBranding",
  legalName: "CWBranding Ltda",
  url: "https://www.cwbranding.com.br",
  locale: "en_CA",
  lang: "en-CA",
  foundingDate: "2022-05-06",
  foundingYear: "2022",
  cnpj: "46.292.260/0001-89",
  tagline: "The strategy behind your company",
  description:
    "Branding and digital marketing agency from Curitiba, focused on Canadian companies. Social media, visual identity, paid traffic, and brand positioning for brands across Canada.",
  title: "CWBranding | Branding and digital marketing agency in Canada",
  keywords: [
    "branding agency Canada",
    "digital marketing agency Canada",
    "marketing agency Curitiba",
    "branding for Canadian businesses",
    "social media agency Canada",
    "paid traffic management",
    "branding",
  ],
  address: {
    streetAddress: "Rua Ébano Pereira, 11, Conj. 1401",
    addressLocality: "Curitiba",
    addressRegion: "PR",
    postalCode: "80410-240",
    addressCountry: "BR",
    landmark: "across from Palácio Avenida",
  },
  geo: {
    latitude: -25.4335,
    longitude: -49.2768,
  },
  areasServed: ["Canada", "Toronto", "Ontario", "Curitiba"],
  priceRange: "$3,599 – $9,999 CAD",
  contact,
  sameAs: [contact.instagram, contact.linkedin],
  ogImage: "/og-image.jpg",
  logo: "/cwbranding/cwbrandinglogo.png",
} as const;

export type SiteConfig = typeof site;
