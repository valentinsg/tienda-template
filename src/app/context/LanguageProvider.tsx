"use client";
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LanguageContextType {
  isSpanish: boolean;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [isSpanish, setIsSpanish] = useState(true); 

  const toggleLanguage = () => {
    setIsSpanish(prevLang => !prevLang);
  };

  return (
    <LanguageContext.Provider value={{ isSpanish, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
