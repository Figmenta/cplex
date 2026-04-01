"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/context";

export default function NotFoundContent() {
  const { locale, t } = useLocale();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center  flex-col overflow-hidden  bg-linear-to-b from-[#3A346C1A] from-15% to-[#332E8F]">
      <div className="flex flex-col gap-12 lg:gap-[2vw] items-center justify-center px-6 md:px-[3vw] pt-[13vw] pb-[15vw]">
        <img src="/new.gif" alt="404" className="w-full md:max-w-[27vw] h-auto" />

        <div className="flex flex-col gap-6 md:gap-[1.5vw] items-center justify-center">
          {/* Error Message */}
          <p className="text-nowrap text-xl md:text-[1.1vw] lg:text-[1.5vw] font-light transition-all duration-300">
          {t("pageNotFound")}
          </p>

          {/* Go Back Button - Using project's purple color */}
          <Link
            href={`/${locale}`}
            className="cursor-pointer w-fit mx-auto text-md md:text-[1vw] px-4 py-2 md:px-[1.7vw] md:py-[0.7vw] rounded-xl lg:rounded-[0.7vw] bg-[#440FBE] hover:bg-[#3b29ff] transition-colors duration-300"
          >
            {t("goBackToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
