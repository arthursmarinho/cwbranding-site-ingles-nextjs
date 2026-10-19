import { services } from "@/app/data/services";
import { translations } from "@/app/utils/translations";
import { site } from "@/app/utils/site";

const address = {
  "@type": "PostalAddress",
  streetAddress: site.address.streetAddress,
  addressLocality: site.address.addressLocality,
  addressRegion: site.address.addressRegion,
  postalCode: site.address.postalCode,
  addressCountry: site.address.addressCountry,
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "LocalBusiness", "Organization"],
  "@id": `${site.url}/#organization`,
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  logo: `${site.url}${site.logo}`,
  image: `${site.url}${site.ogImage}`,
  description: site.description,
  foundingDate: site.foundingDate,
  taxID: site.cnpj,
  telephone: site.contact.phone,
  email: site.contact.email,
  priceRange: site.priceRange,
  address,
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.latitude,
    longitude: site.geo.longitude,
  },
  areaServed: site.areasServed.map((name) => ({
    "@type": "City",
    name,
  })),
  sameAs: site.sameAs,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: site.contact.phone,
    contactType: "sales",
    areaServed: ["CA", "BR"],
    availableLanguage: ["English"],
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "CWBranding plans",
    itemListElement: translations.EN.plans.map((plan) => ({
      "@type": "Offer",
      name: plan.title,
      description: plan.description,
      price: plan.price.replace(".", ""),
      priceCurrency: "CAD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: plan.price.replace(".", ""),
        priceCurrency: "CAD",
        unitText: "MONTH",
      },
    })),
  },
  makesOffer: services.map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service.en.title,
      description: service.en.shortDesc,
    },
  })),
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.name,
  description: site.description,
  inLanguage: "en-CA",
  publisher: { "@id": `${site.url}/#organization` },
};

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function serviceJsonLd(service: (typeof services)[number]) {
  const url = `${site.url}/services/${service.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.en.title,
      description: service.en.shortDesc,
      url,
      provider: { "@id": `${site.url}/#organization` },
      areaServed: site.areasServed.map((name) => ({
        "@type": "City",
        name,
      })),
      serviceType: service.en.title,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: site.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: `${site.url}/services`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: service.en.title,
          item: url,
        },
      ],
    },
  ];
}

export const homeFaqItems = translations.EN.faqItems;
