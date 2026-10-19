"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import type { PortfolioProject } from "@/app/data/portfolio";
import { contact } from "@/app/utils/contact";
import { Laptop, Phone } from "@/app/components/ui/DeviceMockups";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const arrowClass =
  "size-10 border-white/20 bg-[#004D4C]/80 text-white hover:bg-[#E8C39E] hover:text-[#004D4C]";

// "Sites já desenvolvidos": texto à esquerda e carrossel com notebook + celular à direita.
export function PortfolioSection({ projects }: { projects: PortfolioProject[] }) {
  const { t } = useLanguage();
  const isLandingPage = projects[0].type === "landing-page";
  const [titleLine1, titleLine2] = isLandingPage ? t.portfolioTitleLanding : t.portfolioTitleSites;

  return (
    <section className="mt-24 grid items-center gap-12 lg:grid-cols-[2fr_3fr]">
      <div>
        <h2 className="font-display text-4xl uppercase leading-none md:text-6xl">
          <span className="block text-white">{titleLine1}</span>
          <span className="block text-[#E8C39E]">{titleLine2}</span>
        </h2>
        <p className="mt-6 leading-relaxed text-white/80">{t.portfolioText}</p>
        <Link
          href={contact.formHref}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#E8C39E] px-6 py-3 text-sm font-semibold text-[#004D4C] transition-colors hover:bg-white"
        >
          {t.serviceWhatsapp}
        </Link>
      </div>

      <Carousel opts={{ loop: true }} className="relative">
        <CarouselContent>
          {projects.map((project) => (
            <CarouselItem key={project.url}>
              {/* Notebook com o celular sobreposto no canto */}
              <div className="relative px-2 pb-6 pr-[14%]">
                <Laptop src={project.desktopImage} alt={`${project.name} website on desktop`} />
                <div className="absolute bottom-0 right-0 w-[22%]">
                  <Phone src={project.mobileImage} alt={`${project.name} website on mobile`} />
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xl">{project.name}</p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm transition-colors hover:border-[#E8C39E] hover:text-[#E8C39E]"
                >
                  <ExternalLink className="size-4" /> {t.portfolioViewProject}
                </a>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Setas só aparecem quando há mais de um projeto */}
        {projects.length > 1 && (
          <>
            <CarouselPrevious className={`${arrowClass} left-0 top-1/3 my-0`} />
            <CarouselNext className={`${arrowClass} right-0 top-1/3 my-0`} />
          </>
        )}
      </Carousel>
    </section>
  );
}
