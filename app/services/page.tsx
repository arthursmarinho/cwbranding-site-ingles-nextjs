import type { Metadata } from "next";
import Link from "next/link";
import { services, getServicePath } from "@/app/data/services";
import { site } from "@/app/utils/site";
import { JsonLd } from "@/app/components/JsonLd";

export const metadata: Metadata = {
  title: "Branding and digital marketing services in Canada",
  description:
    "CWBranding from Curitiba — social media, visual identity, paid traffic, landing pages, SEO, websites, branding, and more for Canadian companies.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    url: `${site.url}/services`,
    title: "Services | CWBranding",
    description:
      "Social media, visual identity, paid traffic, and more branding services across Canada.",
  },
};

const listJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "CWBranding services",
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: service.en.title,
    url: `${site.url}${getServicePath(service)}`,
  })),
};

export default function ServicesIndexPage() {
  return (
    <main className="relative min-h-screen bg-[#004D4C] text-white">
      <JsonLd data={listJsonLd} />
      <div className="mx-auto max-w-5xl px-6 py-28 md:py-36">
        <p className="font-mono text-xs uppercase tracking-widest text-[#E8C39E] mb-4">
          CWBranding · Canada
        </p>
        <h1 className="font-display text-4xl md:text-6xl leading-tight mb-6">
          Branding & digital marketing services
        </h1>
        <p className="max-w-2xl text-white/80 text-lg leading-relaxed mb-16">
          Strategy, design, and digital presence for Canadian companies that
          need to be recognized and generate demand. Our team is in Curitiba;
          our focus is your growth in Canada.
        </p>
        <ul className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <li key={service.slug}>
              <Link
                href={getServicePath(service)}
                className="block rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-[#E8C39E]/50 hover:bg-white/[0.06] transition-colors"
              >
                <h2 className="font-display text-2xl text-[#E8C39E] mb-2">
                  {service.en.title}
                </h2>
                <p className="text-sm text-white/75 leading-relaxed">
                  {service.en.shortDesc}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
