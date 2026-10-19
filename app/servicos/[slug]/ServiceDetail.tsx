"use client";

import Image from "next/image";
import Link from "next/link";
import { Briefcase, CheckCircle2, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import {
  getServicePath,
  getServiceText,
  services,
  type ServiceContent,
} from "@/app/data/services";
import { getPortfolioForService } from "@/app/data/portfolio";
import { contact } from "@/app/utils/contact";
import { getServiceImageUrl } from "@/app/utils/serviceImages";
import { PortfolioSection } from "./PortfolioSection";

// Conteúdo da página de um serviço, no idioma escolhido no site.
export function ServiceDetail({ service }: { service: ServiceContent }) {
  const { language, t } = useLanguage();
  const text = getServiceText(service, language);
  const otherServices = services.filter((item) => item.slug !== service.slug);
  const portfolio = getPortfolioForService(service.slug);

  return (
    <div className="min-h-screen bg-[#004D4C] text-white">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-28 md:pt-36">
        <Link
          href="/#servicos"
          className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-white/70 transition-colors hover:text-[#E8C39E]"
        >
          <ChevronLeft className="size-4" /> {t.serviceBack}
        </Link>

        {/* 1. Topo: título, introdução e botões */}
        <section className="mt-10 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="flex items-center gap-2 text-sm uppercase tracking-widest text-[#E8C39E]">
              <Briefcase className="size-4" /> {t.serviceEyebrow}
            </p>
            <h1 className="mt-4 font-display text-5xl leading-tight md:text-6xl">{text.title}</h1>
            <p className="mt-4 text-xl text-[#E8C39E] md:text-2xl">{text.subtitle}</p>
            <div className="mt-6 space-y-4 leading-relaxed text-white/85">
              {text.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={contact.formHref}
                className="inline-flex items-center gap-2 rounded-full bg-[#E8C39E] px-6 py-3 text-sm font-semibold text-[#004D4C] transition-colors hover:bg-white"
              >
                {t.serviceWhatsapp}
              </Link>
              <Link
                href={contact.formHref}
                className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold transition-colors hover:border-[#E8C39E] hover:text-[#E8C39E]"
              >
                {t.serviceQuote}
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={getServiceImageUrl(service.id)}
              alt={`${text.title} — CWBranding`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* Sites já desenvolvidos (só em Sites Institucionais e Landing Pages) */}
        {portfolio.length > 0 && <PortfolioSection projects={portfolio} />}

        {/* 2. Benefícios */}
        <section className="mt-24">
          <h2 className="font-display text-3xl md:text-4xl">{t.serviceBenefitsTitle}</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {text.benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#E8C39E]" />
                <span className="text-white/90">{benefit}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. O que está incluso */}
        <section className="mt-24">
          <h2 className="font-display text-3xl md:text-4xl">{t.serviceIncludesTitle}</h2>
          <ol className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {text.includes.map((item, index) => (
              <li key={item} className="flex items-center gap-4 border-b border-white/10 pb-4">
                <span className="font-display text-2xl text-[#E8C39E]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-white/90">{item}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* 4. Perguntas frequentes */}
        <section className="mt-24 max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl">{t.serviceFaqTitle}</h2>
          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {text.faq.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-medium">
                  <span>{item.question}</span>
                  <span aria-hidden className="mt-1 shrink-0 text-[#E8C39E] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-white/80">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 5. Chamada final */}
        <section className="mt-24 rounded-3xl bg-[#E8C39E] p-8 text-center text-[#004D4C] md:p-12">
          <h2 className="font-display text-3xl md:text-4xl">{t.serviceCtaTitle}</h2>
          <p className="mx-auto mt-4 max-w-xl text-[#004D4C]/80">{t.serviceCtaText}</p>
          <Link
            href={contact.formHref}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#004D4C] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0E6B67]"
          >
            {t.serviceQuote}
          </Link>
        </section>

        {/* Outros serviços */}
        <nav aria-label={t.serviceOthersTitle} className="mt-20">
          <h2 className="text-lg font-semibold">{t.serviceOthersTitle}</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {otherServices.map((item) => (
              <li key={item.slug}>
                <Link
                  href={getServicePath(item)}
                  className="inline-flex rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition-colors hover:border-[#E8C39E] hover:text-[#E8C39E]"
                >
                  {getServiceText(item, language).title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
