"use client";

import React from "react";
import { useLocale } from "@/lib/i18n/context";
import { usePathname, useRouter } from "next/navigation";
import { SWITCHERLOCALES } from "@/lib/i18n/constants";
import { setCookie } from "cookies-next";

const LanguageSwitcher: React.FC = () => {
  const { locale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  // Switch language and navigate to the equivalent path in the new language
  const handleLanguageChange = (newLocale: string) => {
    // Extract the path without the language prefix
    const pathWithoutLocale = pathname.replace(/^\/(en|it)/, "") || "/";

    // Set new locale in the locale storage
    setCookie("NEXT_LOCALE", newLocale, {
      maxAge: 60 * 60 * 24 * 30 * 12, // 12 months
      domain: "figmenta.com",
      path: "/",
      sameSite: "lax",
      secure: true,
    });

    // Navigate to the same path but with new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="flex items-center gap-2 h-full">
      {SWITCHERLOCALES.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLanguageChange(loc)}
          className={`
            uppercase
            px-2 py-1.5 rounded-[4px]
            text-[15px] font-bold
            leading-none
            transition-colors duration-200
            ${
              locale === loc
                ? "text-foreground bg-[#232E48]"
                : "text-foreground/50 bg-transparent"
            }
            focus:outline-none
          `}
          disabled={locale === loc}
          tabIndex={0}
        >
          {loc}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
