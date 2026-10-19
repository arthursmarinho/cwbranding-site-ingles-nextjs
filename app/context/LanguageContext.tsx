"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "../utils/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.PT;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language: Language = "EN";

  useEffect(() => {
    localStorage.setItem("lang", "EN");
  }, []);

  const setLanguage = (_lang: Language) => {
    // Site is English-only; keep API for existing components.
  };

  const t = translations.EN;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
