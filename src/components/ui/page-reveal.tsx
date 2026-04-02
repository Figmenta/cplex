"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

/** Dummy tween target for timeline pauses without mutating visible props */
const pauseTween = (duration: number) =>
  gsap.to({ t: 0 }, { t: 1, duration, ease: "none" });

export default function PageReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const langSwitcherRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const header = headerRef.current;
      const langSwitcher = langSwitcherRef.current;
      if (!header) return;

      // Whole header (logo row + side columns) scales & moves — keeps lang column vertically centered with brand.
      gsap.set(header, {
        position: "fixed",
        left: 0,
        right: 0,
        top: "50%",
        yPercent: -50,
        scale: 0.5,
        zIndex: 50,
        transformOrigin: "50% 50%",
      });

      if (langSwitcher) {
        gsap.set(langSwitcher, { autoAlpha: 0, pointerEvents: "none" });
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(header, {
        scale: 1,
        duration: 0.85,
        ease: "power3.out",
      });

      tl.add(pauseTween(1));

      tl.to(header, {
        top: 0,
        yPercent: 0,
        duration: 1.15,
        ease: "power3.inOut",
      });

      if (langSwitcher) {
        tl.to(
          langSwitcher,
          {
            autoAlpha: 1,
            pointerEvents: "auto",
            duration: 0.55,
            ease: "power2.out",
          },
          ">"
        );
      }

      return () => {
        tl.kill();
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-dvh w-full overflow-x-hidden bg-background text-foreground"
    >
      <header
        ref={headerRef}
        className="fixed left-0 right-0 top-1/2 z-50 flex -translate-y-1/2 scale-[0.5] transform items-center justify-between gap-3 px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-4 md:gap-6 md:px-10"
      >
        {/* Equal side columns so the brand stays optically centered */}
        <div className="min-w-0 flex-1" aria-hidden />
        <div className="flex w-full min-w-0 max-w-2xl shrink-0 flex-col items-center gap-1 px-2 bg-red-500 text-center sm:px-4">
          <Image
            src="/logo.svg"
            alt="CP | LEX"
            width={800}
            height={800}
            className="h-8 w-auto max-w-full select-none"
          />
          <p className="font-mono text-[8px] font-medium leading-snug tracking-wide text-foreground">
            Justice, Integrity, and Excellence in Practice
          </p>
          <p className="text-[7px] font-light tracking-[0.2em] uppercase">
            EST. 1985
          </p>
        </div>
        <div
          ref={langSwitcherRef}
          className="pointer-events-none invisible flex min-h-[40px] min-w-[72px] flex-1 items-center justify-end md:min-w-[88px]"
        >
          <LanguageSwitcher />
        </div>
      </header>
    </div>
  );
}
