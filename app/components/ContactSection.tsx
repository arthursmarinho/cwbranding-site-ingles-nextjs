"use client";

import { useActionState, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { contact } from "../utils/contact";
import { submitContact } from "../actions/contact";
import {
  HONEYPOT_FIELD,
  REQUIRED_FIELDS,
  REVENUE_OPTIONS,
  TRAFFIC_OPTIONS,
  formatPhone,
  type ContactField,
  type ContactFormState,
  type ContactValues,
} from "../utils/contactForm";
import { Reveal } from "./ui/Reveal";

const initialState: ContactFormState = { status: "idle" };

const emptyValues: ContactValues = {
  name: "",
  phone: "",
  email: "",
  instagram: "",
  revenue: "",
  traffic: "",
  objective: "",
};

const fieldClass =
  "w-full rounded-xl border bg-[#003533]/70 px-4 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-[#E8C39E]/70";

export function ContactSection() {
  const { t, language } = useLanguage();
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  // Campos controlados: o React 19 limpa o form após cada envio,
  // e assim o que a pessoa digitou não se perde quando há erro.
  const [values, setValues] = useState<ContactValues>(emptyValues);

  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  const set = (field: ContactField, value: string) =>
    setValues((v) => ({ ...v, [field]: field === "phone" ? formatPhone(value) : value }));

  const borderFor = (field: ContactField) =>
    fieldErrors?.[field] ? "border-red-400/80" : "border-white/10";

  const label = (field: ContactField) => (
    <label
      htmlFor={`contact-${field}`}
      className="mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-white/85"
    >
      {t.contactLabels[field]}
      {REQUIRED_FIELDS.includes(field) && (
        <span aria-hidden className="ml-1 text-sm leading-none text-[#E8C39E]">
          *
        </span>
      )}
    </label>
  );

  const error = (field: ContactField) =>
    fieldErrors?.[field] && (
      <p id={`contact-${field}-error`} className="mt-1.5 text-xs text-red-300">
        {t.contactFieldErrors[fieldErrors[field]]}
      </p>
    );

  const a11y = (field: ContactField) => ({
    id: `contact-${field}`,
    name: field,
    "aria-invalid": !!fieldErrors?.[field],
    "aria-describedby": fieldErrors?.[field] ? `contact-${field}-error` : undefined,
  });

  const select = (
    field: "revenue" | "traffic",
    options: readonly string[],
    labels: Record<string, string>,
  ) => (
    <div>
      {label(field)}
      <div className="relative">
        <select
          {...a11y(field)}
          value={values[field]}
          onChange={(e) => set(field, e.target.value)}
          className={`${fieldClass} ${borderFor(field)} h-[42px] cursor-pointer appearance-none pr-10 [&>option]:bg-[#004D4C]`}
        >
          <option value="">
            {t.contactSelectPlaceholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {labels[option]}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-white/70"
        />
      </div>
      {error(field)}
    </div>
  );

  return (
    <section
      id="contact"
      className="relative scroll-mt-16 overflow-hidden bg-[radial-gradient(ellipse_at_top_left,#0A4B48_0%,#04302E_55%,#032826_100%)] px-6 py-20 md:px-12 md:py-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="max-w-md">
            <h2 className="font-display text-6xl uppercase leading-[0.95] md:text-7xl">
              <span className="text-white">{t.contactTitleLine1}</span>
              <br />
              <span className="text-[#E8C39E]">{t.contactTitleLine2}</span>
            </h2>

            <div className="mt-10 space-y-4 text-sm leading-relaxed text-white/85 md:text-[15px]">
              <p>{t.contactParagraph1}</p>
              <p>{t.contactParagraph2}</p>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-[#E8C39E]">
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <FaInstagram className="size-4" /> Instagram
              </a>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <FaLinkedin className="size-4" /> LinkedIn
              </a>
            </div>

            <a
              href="#contact-form"
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#0E6B67] py-3 px-6 text-sm font-medium text-white transition-colors hover:bg-[#12807A]"
            >
              {t.contactWhatsappButton}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div
            id="contact-form"
            className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#0A3F3D]/70 p-6 shadow-2xl shadow-black/20 sm:p-8"
          >
            <AnimatePresence mode="wait" initial={false}>
              {state.status === "success" ? (
                <motion.div
                  key="success"
                  role="status"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <CheckCircle2 className="size-14 text-[#E8C39E]" strokeWidth={1.5} />
                  <h3 className="mt-6 font-display text-3xl text-white md:text-4xl">
                    {t.contactSuccessTitle}
                  </h3>
                  <p className="mt-3 max-w-xs text-white/80">{t.contactSuccessText}</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  action={formAction}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <input type="hidden" name="language" value={language} />
                  <input
                    type="text"
                    name={HONEYPOT_FIELD}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />

                  <div>
                    {label("name")}
                    <input
                      {...a11y("name")}
                      type="text"
                      required
                      maxLength={120}
                      autoComplete="name"
                      placeholder={t.contactPlaceholders.name}
                      value={values.name}
                      onChange={(e) => set("name", e.target.value)}
                      className={`${fieldClass} ${borderFor("name")} h-[42px]`}
                    />
                    {error("name")}
                  </div>

                  <div>
                    {label("phone")}
                    <input
                      {...a11y("phone")}
                      type="tel"
                      inputMode="tel"
                      required
                      autoComplete="tel-national"
                      placeholder={t.contactPlaceholders.phone}
                      value={values.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      className={`${fieldClass} ${borderFor("phone")} h-[42px]`}
                    />
                    {error("phone")}
                  </div>

                  <div>
                    {label("email")}
                    <input
                      {...a11y("email")}
                      type="email"
                      maxLength={200}
                      autoComplete="email"
                      placeholder={t.contactPlaceholders.email}
                      value={values.email}
                      onChange={(e) => set("email", e.target.value)}
                      className={`${fieldClass} ${borderFor("email")} h-[42px]`}
                    />
                    {error("email")}
                  </div>

                  <div>
                    {label("instagram")}
                    <input
                      {...a11y("instagram")}
                      type="text"
                      maxLength={200}
                      placeholder={t.contactPlaceholders.instagram}
                      value={values.instagram}
                      onChange={(e) => set("instagram", e.target.value)}
                      className={`${fieldClass} ${borderFor("instagram")} h-[42px]`}
                    />
                    {error("instagram")}
                  </div>

                  {select("revenue", REVENUE_OPTIONS, t.contactRevenueOptions)}
                  {select("traffic", TRAFFIC_OPTIONS, t.contactTrafficOptions)}

                  <div>
                    {label("objective")}
                    <textarea
                      {...a11y("objective")}
                      rows={4}
                      required
                      maxLength={2000}
                      placeholder={t.contactPlaceholders.objective}
                      value={values.objective}
                      onChange={(e) => set("objective", e.target.value)}
                      className={`${fieldClass} ${borderFor("objective")} resize-y py-3`}
                    />
                    {error("objective")}
                  </div>

                  {state.status === "error" && (
                    <p role="alert" className="text-sm text-red-300">
                      {t.contactErrors[state.reason]}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={pending}
                    className="h-10 w-full rounded-full bg-[#0E6B67] text-xs font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-[#12807A] disabled:cursor-wait disabled:opacity-70"
                  >
                    {pending ? t.contactSubmitting : t.contactSubmit}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
