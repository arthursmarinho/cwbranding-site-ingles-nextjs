"use client";

import { useLanguage } from "../context/LanguageContext";
import { Reveal } from "./ui/Reveal";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { contact } from "../utils/contact";

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section
      id="about"
      className="relative bg-[#004D4C] py-28 md:py-40 px-6 md:px-12 overflow-hidden scroll-mt-16"
    >
      <div className="mx-auto max-w-[1400px] grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-6">
          <Reveal>
            <div className="flex flex-row items-center gap-4">
              <div>
                <Image
                  src="/cwbranding/pinhao.webp"
                  alt="CWBranding pine symbol — Curitiba agency serving Canada"
                  width={130}
                  height={200}
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 110px, 150px"
                  className="w-[80px] sm:w-[110px] md:w-[130px] lg:w-[150px] h-auto"
                />
              </div>
              <div>
                <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
                  <span className="italic opacity-80 text-[#E8C39E]">
                    {t.aboutTitleLine1}
                  </span>
                  <br />
                  <span className="text-white">{t.aboutTitleLine2}</span>
                </h2>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-6 space-y-6 text-lg md:text-xl leading-relaxed text-white">
          <Reveal delay={0.1}>
            <p>{t.aboutParagraph1}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="opacity-85">{t.aboutParagraph2}</p>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="opacity-85">{t.aboutParagraph3}</p>
          </Reveal>
          <Reveal delay={0.35}>
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex bg-white text-[#004D4C] items-center gap-3 mt-6 border border-[color:var(--sand-soft)]/60 rounded-full px-7 py-3 text-sm tracking-[0.2em] uppercase hover:bg-[color:var(--sand-soft)] hover:text-[#004D4C] transition"
            >
              Instagram <FaInstagram className="size-4" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
