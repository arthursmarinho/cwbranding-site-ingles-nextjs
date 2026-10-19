"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { contact } from "../utils/contact";

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-[#E8C39E]">
      {children}
    </p>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-full border border-white/15 text-[#E8C39E] transition-all duration-300 hover:border-[#E8C39E] hover:bg-[#E8C39E]/10 hover:text-[color:var(--sand-soft)]"
    >
      {children}
    </a>
  );
}

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#004d4c] text-[color:var(--sand-soft)]/75">
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 md:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-8">
            <div className="lg:col-span-3">
              <p className="font-display text-2xl tracking-[0.3em] text-[color:var(--sand-soft)]">
                CWBRANDING<sup className="text-[10px]">®</sup>
              </p>
              <p className="mt-5 max-w-sm text-sm leading-relaxed">
                {t.footerDescription}
              </p>

              <div className="mt-8 flex items-center gap-3">
                <SocialLink href={contact.instagram} label="Instagram">
                  <FaInstagram className="size-4" />
                </SocialLink>
                <SocialLink href={contact.linkedin} label="LinkedIn">
                  <FaLinkedin className="size-4" />
                </SocialLink>
              </div>
            </div>

            <div className="lg:col-span-2">
              <FooterHeading>{t.footerNavTitle}</FooterHeading>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="/servicos"
                    className="transition-colors hover:text-[color:var(--sand-soft)]"
                  >
                    {t.services}
                  </a>
                </li>
                <li>
                  <a
                    href="/#sobre"
                    className="transition-colors hover:text-[color:var(--sand-soft)]"
                  >
                    {t.about}
                  </a>
                </li>
                <li>
                  <a
                    href="/#espaco"
                    className="transition-colors hover:text-[color:var(--sand-soft)]"
                  >
                    {t.navSpace}
                  </a>
                </li>
                <li>
                  <a
                    href="/#clientes"
                    className="transition-colors hover:text-[color:var(--sand-soft)]"
                  >
                    {t.navClients}
                  </a>
                </li>
                <li>
                  <a
                    href="/#planos"
                    className="transition-colors hover:text-[color:var(--sand-soft)]"
                  >
                    {t.navPlans}
                  </a>
                </li>
                <li>
                  <a
                    href="/#faq"
                    className="transition-colors hover:text-[color:var(--sand-soft)]"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <Link
                    href={contact.formHref}
                    className="transition-colors hover:text-[color:var(--sand-soft)]"
                  >
                    {t.contact}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <FooterHeading>{t.footerContactTitle}</FooterHeading>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0 text-[#E8C39E]" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="transition-colors hover:text-[color:var(--sand-soft)]"
                  >
                    {contact.phoneDisplay}
                  </a>
                </li>

                <li className="flex items-center gap-3">
                  <Mail className="size-4 shrink-0 text-[#E8C39E]" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="break-all transition-colors hover:text-[color:var(--sand-soft)]"
                  >
                    {contact.email}
                  </a>
                </li>

                <li className="flex items-start gap-3 pt-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#E8C39E]" />
                  <div>
                    <p className="whitespace-pre-line leading-relaxed">
                      {t.footerAddress}
                    </p>
                    <a
                      href={contact.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center text-[#E8C39E] transition-colors hover:text-[color:var(--sand-soft)]"
                    >
                      {t.footerViewMap}
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="flex flex-col lg:col-span-4">
              <FooterHeading>{t.spaceLocation}</FooterHeading>
              <div className="min-h-[220px] flex-1 overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-black/10">
                <iframe
                  title="CWBranding location"
                  src={contact.mapEmbedUrl}
                  className="h-full w-full min-h-[220px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-6 py-6 text-xs opacity-60 md:flex-row md:px-12">
            <p>
              © {new Date().getFullYear()} CWBranding Ltda. CNPJ
              46.292.260/0001-89. {t.footerRights}
            </p>
            <p className="tracking-[0.15em] uppercase">CWB / SP / TOR</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
