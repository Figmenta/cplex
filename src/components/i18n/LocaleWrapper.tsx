"use client";

import React from 'react';
import { LocaleProvider } from '@/lib/i18n/context';
import { translations } from '@/lib/i18n/translations';

/**
 * LocaleWrapper props
 */
type LocaleWrapperProps = {
  children: React.ReactNode;
  locale: string;
};

/**
 * LocaleWrapper component
 * Wraps the application with the locale context provider
 */
const LocaleWrapper: React.FC<LocaleWrapperProps> = ({ children, locale }) => {
  return (
    <LocaleProvider initialLocale={locale} translations={translations}>
      {children}
    </LocaleProvider>
  );
};

export default LocaleWrapper; 