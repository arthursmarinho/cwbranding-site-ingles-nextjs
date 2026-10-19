"use client";

import { useLanguage } from "../context/LanguageContext";
import { getServiceText, services } from "../data/services";
import { Reveal } from "./ui/Reveal";
import { ServiceCard } from "./ui/ServiceCard";

export function ServicesSection() {
  const { t, language } = useLanguage();

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#004A4A] py-28 md:py-40 pl-6 md:pl-12 pr-4 md:pr-5 scroll-mt-16"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-14 xl:gap-16">
          <div>
            <Reveal>
              <h2 className="font-display text-5xl md:text-7xl lg:text-8xl">
                <span className="italic text-[#E8C39E]">
                  {t.servicesTitleLine1}
                </span>{" "}
                <span className="text-white">{t.servicesTitleLine2}</span>
              </h2>
            </Reveal>

            <div className="mt-10 max-w-xl">
              <Reveal delay={0.1}>
                <p className="text-base md:text-lg leading-relaxed text-zinc-300">
                  {t.servicesDescription}
                </p>
              </Reveal>
            </div>
          </div>

          <div className="flex h-[300px] w-full items-center justify-center md:h-[450px] lg:h-[620px] xl:mr-64 xl:h-[700px] lg:justify-end lg:w-full mb-36">
            <img
              src={t.serviceMainImage}
              alt="CWBranding creative process — Curitiba team, Canadian clients"
              className="h-full w-full object-contain lg:object-right"
            />
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
          {services.map((service, i) => {
            const text = getServiceText(service, language);
            return (
              <ServiceCard
                key={service.slug}
                index={i}
                title={text.title}
                desc={text.shortDesc}
                id={service.id}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
