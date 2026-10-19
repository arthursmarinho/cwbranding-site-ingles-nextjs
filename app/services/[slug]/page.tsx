import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, getServicePath, services } from "@/app/data/services";
import { getServiceImageUrl } from "@/app/utils/serviceImages";
import { site } from "@/app/utils/site";
import { JsonLd } from "@/app/components/JsonLd";
import { faqJsonLd, serviceJsonLd } from "@/app/utils/jsonld";
import { ServiceDetail } from "./ServiceDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };

  const path = getServicePath(service);
  const title = `${service.en.title} | CWBranding`;
  const description = service.en.shortDesc;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `${site.url}${path}`,
      type: "website",
      images: [{ url: getServiceImageUrl(service.id), alt: `${service.en.title} — CWBranding` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd data={[...serviceJsonLd(service), faqJsonLd(service.en.faq)]} />
      <ServiceDetail service={service} />
    </>
  );
}
