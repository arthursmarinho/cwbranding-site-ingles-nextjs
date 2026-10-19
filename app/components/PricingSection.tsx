"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";
import Link from "next/link";
import { contact } from "../utils/contact";

export default function PricingSection() {
  const { t } = useLanguage();

  const plans = t.plans || [];

  return (
    <section id="plans" className="scroll-mt-16 bg-[#EBF5F5] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display tracking-tight text-[#004d4c]">
            <span className="italic">{t.pricingTitleLine1}</span>{" "}
            {t.pricingTitleLine2}
          </h2>

          <p className="mt-4 text-sm uppercase tracking-widest opacity-80 max-w-md mx-auto">
            {t.pricingSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {plans.map((plan, index) => {
            const highlighted = "highlighted" in plan && plan.highlighted;

            return (
              <div
                key={index}
                className={`relative p-8 md:p-10 transition-all duration-300 shadow-lg shadow-[var(--brand-ink)]/5 ring-2 ring-[#E8C39E] border border-[#E8C39E] flex flex-col justify-between rounded-sm ${
                  highlighted
                    ? "bg-[#004d4c] text-white"
                    : "bg-white text-[#004d4c]"
                }`}
              >
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#E8C39E] font-medium">
                    {plan.tagline}
                  </span>

                  <h3
                    className={`text-3xl font-display mt-1 mb-2 ${
                      highlighted ? "text-white" : "text-[#004d4c]"
                    }`}
                  >
                    {plan.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed mb-8 font-light italic ${
                      highlighted ? "text-white/90" : "text-[#004d4c]/90"
                    }`}
                  >
                    {plan.description}
                  </p>
                 

                  {"subHeader" in plan && plan.subHeader && (
                    <p className="text-xs italic text-[#E8C39E] mb-4">
                      {plan.subHeader}
                    </p>
                  )}

                  <hr
                    className={`my-6 ${
                      highlighted
                        ? "border-white/20"
                        : "border-[var(--brand-ink)]/10"
                    }`}
                  />

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start text-xs uppercase tracking-wider ${
                          highlighted
                            ? "text-white/90"
                            : "text-[var(--brand-ink)]"
                        }`}
                      >
                        <span className="inline-block w-1.5 h-1.5 bg-[#E8C39E] rotate-45 mr-3 mt-1.5 flex-shrink-0" />
                        <span className="opacity-80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-lg font-light font-display text-[#E8C39E]">
                        ${" "}
                      </span>

                      <span className="text-4xl md:text-5xl font-display tracking-tight text-[#E8C39E]">
                        {plan.price}
                      </span>

                      <span
                        className={`text-xs ml-2 ${
                          highlighted ? "text-white/60" : "opacity-60"
                        }`}
                      >
                        {t.pricingPeriod}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={contact.formHref}
                    className={`w-full py-4 text-center block text-xs uppercase tracking-widest transition-all duration-300 border font-semibold ${
                      highlighted
                        ? "bg-[#E8C39E] text-[#004d4c] border-[#E8C39E] hover:bg-white hover:text-[#004d4c] hover:border-white"
                        : "bg-[#E8C39E] text-[#004d4c] border-[#E8C39E] hover:bg-[#004d4c] hover:text-white hover:border-[#004d4c]"
                    }`}
                  >
                    {t.pricingButton}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
