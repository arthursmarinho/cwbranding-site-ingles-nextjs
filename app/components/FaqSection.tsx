"use client";

import { useLanguage } from "../context/LanguageContext";
import { Reveal } from "./ui/Reveal";

export function FaqSection() {
  const { t } = useLanguage();

  return (
    <section
      id="faq"
      className="scroll-mt-16 bg-[#EBF5F5] px-6 py-20 md:px-12 md:py-28"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2
            id="faq-heading"
            className="font-display text-4xl md:text-5xl tracking-tight text-[#004d4c] mb-12"
          >
            <span className="italic">{t.faqTitleLine1}</span> {t.faqTitleLine2}
          </h2>
        </Reveal>

        <div className="divide-y divide-[#004d4c]/10 border-y border-[#004d4c]/10">
          {t.faqItems.map((item) => (
            <details key={item.question} className="group py-6">
              <summary className="cursor-pointer list-none font-medium text-[#004d4c] text-lg leading-snug flex items-start justify-between gap-4">
                <span>{item.question}</span>
                <span
                  aria-hidden
                  className="mt-1 shrink-0 text-[#E8C39E] transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-[#004d4c]/80 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
