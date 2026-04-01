"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { setCookie } from 'cookies-next';

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

type LocaleProviderProps = {
  children: ReactNode;
  initialLocale: string;
  translations: Record<string, Record<string, string>>;
};

export const LocaleProvider = ({ 
  children, 
  initialLocale, 
  translations 
}: LocaleProviderProps) => {
  const [locale, setLocaleState] = useState(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    
    setLocaleState(newLocale);
    setCookie('NEXT_LOCALE', newLocale, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
    
    // Redirect to the same page but with new locale
    const currentPath = pathname || '/';
    const segments = currentPath.split('/');
    segments[1] = newLocale; // Replace locale segment
    const newPath = segments.join('/');
    
    router.push(newPath);
  };

  const t = (key: string) => {
    return translations[locale]?.[key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}; 