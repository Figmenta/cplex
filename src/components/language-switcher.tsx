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
    <div className="flex h-full items-center gap-0.5 md:gap-1">
      {SWITCHERLOCALES.map((loc, index) => (
        <span key={loc} className="flex items-center gap-0.5 md:gap-2">
          {index > 0 ? (
            <span
              className="select-none text-[10px] font-semibold text-foreground/40 md:text-[10px]"
              aria-hidden
            >
              |
            </span>
          ) : null}
          <button
            onClick={() => handleLanguageChange(loc)}
            className={`
              cursor-pointer uppercase
              rounded-[4px] px-1.5 py-1 text-[10px] font-bold leading-none
              transition-colors duration-200
              md:px-2 md:py-1.5 md:text-[10px]
              ${
                locale === loc
                  ? "text-foreground lg:bg-[#232E48]"
                  : "text-foreground/50 bg-transparent"
              }
              focus:outline-none
            `}
            disabled={locale === loc}
            tabIndex={0}
          >
            {loc}
          </button>
        </span>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
