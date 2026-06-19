"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ro";

type Translations = {
  [key: string]: { en: string; ro: string };
};

export const translations: Translations = {
  home: { en: "Home", ro: "Acasă" },
  listings: { en: "Listings", ro: "Anunțuri" },
  blog: { en: "Blog", ro: "Blog" },
  pages: { en: "Pages", ro: "Pagini" },
  about: { en: "About", ro: "Despre" },
  contact: { en: "Contact", ro: "Contact" },
  signIn: { en: "Sign in", ro: "Conectare" },
  submitListing: { en: "Submit Listing", ro: "Adaugă Anunț" },
  findCars: { en: "Find cars for sale and for rent near you", ro: "Găsește mașini de vânzare și de închiriat lângă tine" },
  perfectCar: { en: "Find Your Perfect Car", ro: "Găsește-ți Mașina Perfectă" },
  all: { en: "All", ro: "Toate" },
  newCar: { en: "New", ro: "Noi" },
  used: { en: "Used", ro: "Second-hand" },
  browseFeatured: { en: "Or Browse Featured Model", ro: "Sau Explorează Modele Populare" },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({
  children,
  initialLang = "en",
}: {
  children: ReactNode;
  initialLang?: Language;
}) {
  const [language, setLanguage] = useState<Language>(initialLang);

  function t(key: string): string {
    return translations[key]?.[language] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
