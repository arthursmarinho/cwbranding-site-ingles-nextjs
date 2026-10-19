"use client";

import { useLanguage } from "../context/LanguageContext";

export function Marquee() {
  const { t } = useLanguage();

  const listA = t.marqueeA || [];
  const listB = t.marqueeB || [];

  return (
    <section className="bg-[#EBF5F5] text-[#004D4C] py-14 overflow-hidden select-none">
      <div className="overflow-hidden p-2">
        <div className="marquee-track to-right font-display text-5xl md:text-7xl">
          {[...listA, ...listA, ...listA].map((item, i) => (
            <span key={i} className="italic">
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="overflow-hidden mt-4 p-2">
        <div className="marquee-track to-left font-display text-5xl md:text-7xl text-[#004D4C]">
          {[...listB, ...listB, ...listB].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
