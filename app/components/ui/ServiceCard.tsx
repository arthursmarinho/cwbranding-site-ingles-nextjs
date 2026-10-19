"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getServiceImageUrl } from "@/app/utils/serviceImages";
import { getServiceById, getServicePath } from "@/app/data/services";

interface ServiceCardProps {
  id: string | number;
  title: string;
  desc: string;
  index: number;
}

const MotionLink = motion.create(Link);

export function ServiceCard({ id, title, desc, index }: ServiceCardProps) {
  const imageUrl = getServiceImageUrl(id);
  const service = getServiceById(id);
  const href = service ? getServicePath(service) : "/servicos";

  return (
    <MotionLink
      href={href}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.7,
        delay: (index % 2) * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative h-96 border border-white/10 rounded-2xl flex flex-col justify-end overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#004D4C]/20 hover:-translate-y-1 decoration-transparent"
    >
      <Image
        src={imageUrl}
        alt={`${title} — CWBranding service for Canadian brands`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 20vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#004D4C]/95 via-[#004D4C]/90 to-transparent transition-all duration-500 md:from-black/80 md:via-black/20 md:group-hover:from-[#004D4C]/95 md:group-hover:via-[#004D4C]/90" />

      <div className="relative z-10 p-6 md:p-8 w-full">
        <h3 className="font-display text-2xl font-semibold text-[#E8C39E] md:text-white md:group-hover:text-[#E8C39E] transition-colors duration-300 inline-flex items-center gap-2">
          {title}
          <ArrowUpRight className="size-5 opacity-80" />
        </h3>

        <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out">
          <div className="overflow-hidden">
            <p className="mt-4 text-sm md:text-base leading-relaxed text-white/80 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 md:delay-100">
              {desc}
            </p>
          </div>
        </div>
      </div>
    </MotionLink>
  );
}
