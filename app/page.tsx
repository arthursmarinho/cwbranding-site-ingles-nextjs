import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { AboutSection } from "./components/AboutSection";
import { BlogSection } from "./components/BlogSection";
import { FaqSection } from "./components/FaqSection";
import { Hero } from "./components/Hero";
import { JsonLd } from "./components/JsonLd";
import { Marquee } from "./components/Marquee";
import { PartnersSection } from "./components/PartnerSection";
import PricingSection from "./components/PricingSection";
import { ContactSection } from "./components/ContactSection";
import { ServicesSection } from "./components/ServiceSection";
import { SpaceSection } from "./components/SpaceSection";
import { faqJsonLd, homeFaqItems } from "./utils/jsonld";
import { site } from "./utils/site";

export const metadata: Metadata = {
  title: { absolute: site.title },
  description: site.description,
  alternates: {
    canonical: "/",
  },
  // Sem openGraph aqui: o da página substituiria o do layout inteiro e
  // a home perderia og:image, siteName e locale.
};

export default async function Home() {
  // Os 3 posts mais recentes para a seção do blog.
  const latestPosts = (await getPublishedPosts()).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={faqJsonLd(homeFaqItems)} />
      <Hero />
      <ServicesSection />
      <AboutSection />
      <Marquee />
      <SpaceSection />
      <PartnersSection />
      <PricingSection />
      <ContactSection />
      <BlogSection posts={latestPosts} />
      <FaqSection />
    </div>
  );
}
