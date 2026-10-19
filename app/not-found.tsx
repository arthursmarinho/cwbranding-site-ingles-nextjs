import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#004D4C] text-white overflow-hidden selection:bg-[#E8C39E] selection:text-[#004D4C]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e8c39e08_1px,transparent_1px),linear-gradient(to_bottom,#e8c39e08_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E8C39E]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-6 py-20 text-center">
        <Image
          src="/cwbranding/pinhao.webp"
          alt=""
          width={80}
          height={120}
          className="mb-8 w-16 h-auto opacity-90"
          aria-hidden
        />

        <p className="font-mono text-sm tracking-[0.3em] uppercase text-[#E8C39E]/80 mb-4">
          Error 404
        </p>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6">
          <span className="italic text-[#E8C39E]">Oops,</span>{" "}
          <span className="text-white">page not found</span>
        </h1>

        <p className="max-w-md text-base md:text-lg text-white/70 leading-relaxed mb-10">
          The page you are looking for does not exist or has been moved. Head
          back home to keep browsing.
        </p>

        <Link
          href="/"
          className="group inline-flex items-center gap-2 border border-[#E8C39E]/30 px-6 py-3 rounded-full text-white hover:bg-[#E8C39E] hover:text-[#004D4C] transition-all duration-300 font-medium"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to home
        </Link>
      </div>
    </div>
  );
}
