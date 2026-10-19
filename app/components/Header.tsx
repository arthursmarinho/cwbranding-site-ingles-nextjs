"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { contact } from "../utils/contact";

export function Header() {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { href: "/#servicos", label: t.services },
    { href: "/#sobre", label: t.about },
    { href: "/#planos", label: t.navPlans },
    // { href: "/blog", label: t.navBlog },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-gradient-to-b from-[#006867] to-[#004A4A] text-[color:var(--sand-soft)]">
      <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10 text-[13px] tracking-[0.18em] uppercase">
        <div className="flex min-w-0 items-center justify-start">
          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Main"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:opacity-70 transition-opacity"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="lg:hidden hover:opacity-70 transition-opacity"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        <Link
          href="/"
          className="justify-self-center block leading-none outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0"
        >
          <Image
            src="/cwbranding/cwbrandinglogo.webp"
            alt="CWBranding"
            width={522}
            height={130}
            priority
            className="block h-10 w-auto md:h-11"
          />
        </Link>

        <div className="flex min-w-0 items-center justify-end">
          <Link
            href={contact.formHref}
            className="hidden hover:opacity-70 transition-opacity lg:inline"
          >
            {t.contact}
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-[#004A4A] lg:hidden transition-all duration-300 ease-in-out border-t border-white/5">
          <nav
            className="flex flex-col p-6 gap-6 text-[14px] tracking-[0.18em] uppercase"
            aria-label="Mobile"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={toggleMenu}
                className="py-2 border-b border-white/5 hover:opacity-70 transition-opacity"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={contact.formHref}
              onClick={toggleMenu}
              className="py-2 border-b border-white/5 hover:opacity-70 transition-opacity"
            >
              {t.contact}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
