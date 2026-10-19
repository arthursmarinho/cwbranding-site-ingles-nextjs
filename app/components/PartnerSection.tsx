"use client";

import { useLanguage } from "../context/LanguageContext";
import { Reveal } from "./ui/Reveal";

const partnerImages = Array.from(
  { length: 24 },
  (_, i) => `/parceiros-cwbranding/${i + 1}.webp`,
);

const CARDS_PER_ROW = 6;

const marqueeRowA = partnerImages.slice(0, CARDS_PER_ROW);
const marqueeRowB = partnerImages.slice(CARDS_PER_ROW, CARDS_PER_ROW * 2);
const marqueeRowC = partnerImages.slice(CARDS_PER_ROW * 2);

function PartnerLogo({
  url,
  alt,
}: {
  url: string;
  alt: string;
}) {
  return (
    <div className="group shrink-0 relative w-32 sm:w-40 md:w-48 lg:w-[calc((min(100vw-6rem,1400px)-5*1.5rem)/6)] aspect-square bg-[var(--sand)] overflow-hidden p-3 sm:p-5 md:p-7 transition-transform duration-500 hover:scale-105 flex items-center justify-center">
      <img
        src={url}
        alt={alt}
        className="max-w-full max-h-full w-auto h-auto object-contain block"
        draggable={false}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function PartnerMarquee({
  images,
  direction,
  partnerLabel,
  slow = false,
}: {
  images: string[];
  direction: "to-left" | "to-right";
  partnerLabel: string;
  slow?: boolean;
}) {
  const loop = [...images, ...images];

  return (
    <div className="mx-auto w-full max-w-[1400px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
      <div
        className={`marquee-track ${direction} ${slow ? "slow" : ""} gap-4 md:gap-6 items-center py-2 hover:[animation-play-state:paused]`}
      >
        {loop.map((url, i) => (
          <PartnerLogo
            key={`${url}-${i}`}
            url={url}
            alt={`${partnerLabel} da CWBranding ${(i % images.length) + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function PartnersSection() {
  const { t } = useLanguage();

  return (
    <section id="clients" className="scroll-mt-16 py-28 md:py-40 px-6 md:px-12 overflow-hidden">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl">
            <span className="italic text-[#004A4A]">
              {t.partnersTitleLine1}
            </span>{" "}
            <span className="text-[#004A4A]">
              {t.partnersTitleLine2}
            </span>
          </h2>
          <p className="text-muted-foreground">{t.partnersParagraph1}</p>
        </Reveal>
      </div>

      <div className="mt-16 space-y-8 md:space-y-10">
        <Reveal delay={0.1}>
          <PartnerMarquee
            images={marqueeRowA}
            direction="to-right"
            partnerLabel={t.partnerLabel}
          />
        </Reveal>

        <Reveal delay={0.2}>
          <PartnerMarquee
            images={marqueeRowB}
            direction="to-left"
            partnerLabel={t.partnerLabel}
          />
        </Reveal>

        <Reveal delay={0.3}>
          <PartnerMarquee
            images={marqueeRowC}
            direction="to-right"
            partnerLabel={t.partnerLabel}
            slow
          />
        </Reveal>
      </div>
    </section>
  );
}