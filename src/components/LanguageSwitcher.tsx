"use client";

import React, { useState } from "react";
import { useLocale } from "@/lib/i18n/context";
import { usePathname, useRouter } from "next/navigation";
import { SWITCHERLOCALES } from "@/lib/i18n/constants";
import { setCookie } from "cookies-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const LanguageSwitcher: React.FC = () => {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer flex items-center gap-[0.4vw] md:gap-[1.5vw] pr-[0.5vw] pb-[0vw] focus:outline-none outline-none">
          <span className="poppins-400 md:relative flex items-center gap-1 text-[5vw] md:text-[0.990rem] font-[400] capitalize  transition-all duration-200">
            {t(
              locale === "en"
                ? "english"
                : locale === "it"
                  ? "italian"
                  : locale === "es"
                    ? "spanish"
                    : locale === "zh"
                      ? "chinese"
                      : "english"
            )}
            <ChevronDown
              className={`size-8 md:size-[1.5vw] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="rounded-2xl bg-[#0C0C0C] border border-border/10 w-[96vw] ml-[2vw] md:w-fit "
      >
        {SWITCHERLOCALES.map((loc, index) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            className={`cursor-pointer px-[20vw]  py-[2.5vw] md:px-[6vw] md:py-[0.8vw] text-lg md:text-[1vw] font-[500] text-foreground text-center transition-colors duration-300 border-none outline-none
               ${index === SWITCHERLOCALES.length - 1 ? "rounded-b-2xl md:rounded-bl-2xl" : index === 0 ? "rounded-t-2xl md:rounded-tl-2xl" : ""} 
              ${locale === loc ? "bg-[#2112D4]" : ""}`}
          >
            {loc === "en"
              ? "English"
              : loc === "it"
                ? "Italiano"
                : loc === "es"
                  ? "Español"
                  : loc === "zh"
                    ? "中"
                    : "English"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
