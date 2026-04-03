"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import LanguageSwitcher from "@/components/language-switcher";
import { FIRM_TABS } from "./content";
import type { ExpertiseSlug } from "./content";
import { NEWS_ITEMS, expertiseSlugToIndex } from "./content";
import { HomeFooter } from "./home-footer";
import { HomeGrid } from "./home-grid";
import { ExpandedFirm } from "./expand-firm";
import { ExpandedNewsIndex } from "./expand-news-index";
import { ExpandedNewsArticle } from "./expanded-news-article";
import { ExpandedExpertise } from "./expanded-expertise";
import { ExpandedProfessionals } from "./expanded-professionals";
import {
  gridOriginToVtName,
  startHomeViewTransition,
} from "./home-view-transition";
import { cn } from "@/lib/utils";

const pauseTween = (duration: number) =>
  gsap.to({ t: 0 }, { t: 1, duration, ease: "none" });

/** Quick opacity pulse before View Transition (no scale — avoids “shrink on click”). */
function playLogoBackAnimation(logoWrap: HTMLElement): Promise<void> {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    gsap.to(logoWrap, {
      opacity: 0.82,
      duration: 0.06,
      ease: "power2.in",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        gsap.set(logoWrap, { clearProps: "opacity" });
        resolve();
      },
    });
  });
}

function HomeLogoMarkup({ imageDecorative = false }: { imageDecorative?: boolean }) {
  return (
    <>
      <Image
        src="/logo.svg"
        alt={imageDecorative ? "" : "CP | LEX"}
        width={800}
        height={800}
        className="h-7 w-auto max-w-full cursor-inherit select-none md:h-8"
        aria-hidden={imageDecorative}
      />
      <p className="cursor-inherit select-none font-montserrat text-[8px] font-medium leading-tight tracking-wide text-foreground md:leading-snug">
        Justice, Integrity, and Excellence in Practice
      </p>
      <p className="cursor-inherit select-none text-[7px] font-light leading-tight tracking-[0.2em] uppercase">
        EST. 1985
      </p>
    </>
  );
}

type FirmTab = (typeof FIRM_TABS)[number]["id"];

type HomeView =
  | { mode: "grid" }
  | { mode: "firm"; tab: FirmTab }
  | { mode: "news" }
  | { mode: "news-article"; id: string }
  | { mode: "expertise"; slug: ExpertiseSlug }
  | { mode: "professionals" };

type GridOrigin =
  | { kind: "cell"; index: number }
  | { kind: "expertise-tile"; innerIndex: number };

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const logoBlockRef = useRef<HTMLDivElement>(null);
  const langSwitcherRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLElement | null)[]>([null, null, null, null]);
  const footerRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const originRef = useRef<GridOrigin>({ kind: "cell", index: 0 });
  const [introDone, setIntroDone] = useState(false);
  const [view, setView] = useState<HomeView>({ mode: "grid" });
  /** During collapse VT: lift the returning card in the same paint as grid (refs/DOM after commit are too late for VT snapshot). */
  const [gridStackOrigin, setGridStackOrigin] = useState<GridOrigin | null>(
    null
  );

  useEffect(() => {
    if (view.mode !== "expertise") return;
    originRef.current = {
      kind: "expertise-tile",
      innerIndex: expertiseSlugToIndex(view.slug),
    };
  }, [view]);

  const runViewTransition = useCallback(
    (update: () => void, liftVtName?: string) => {
      if (busyRef.current) return;
      busyRef.current = true;
      void startHomeViewTransition(update, {
        liftTransitionName: liftVtName,
      }).finally(() => {
        busyRef.current = false;
      });
    },
    []
  );

  const openFromGrid = useCallback(
    (next: HomeView, origin: GridOrigin) => {
      runViewTransition(() => {
        flushSync(() => {
          setGridStackOrigin(null);
          originRef.current = origin;
          setView(next);
        });
      }, gridOriginToVtName(origin));
    },
    [runViewTransition]
  );

  const collapseToGrid = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    const lift = gridOriginToVtName(originRef.current);
    const logoWrap = logoBlockRef.current;
    if (logoWrap) {
      try {
        await playLogoBackAnimation(logoWrap);
      } catch {
        /* ignore */
      }
    }
    void startHomeViewTransition(
      () => {
        flushSync(() => {
          setView({ mode: "grid" });
          setGridStackOrigin(originRef.current);
        });
      },
      { liftTransitionName: lift }
    ).finally(() => {
      busyRef.current = false;
      setGridStackOrigin(null);
    });
  }, []);

  const transitionToView = useCallback((next: HomeView) => {
    void startHomeViewTransition(() => {
      setView(next);
    });
  }, []);

  useGSAP(
    () => {
      const header = headerRef.current;
      const langSwitcher = langSwitcherRef.current;
      const footer = footerRef.current;
      const cells = cellRefs.current.filter((cell): cell is HTMLElement =>
        Boolean(cell)
      );
      if (!header) return;

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

      // Prepare grid cells: 0 & 2 from left, 1 & 3 from right (slightly further out for a softer, slower slide)
      cells.forEach((cell, index) => {
        const fromX = index % 2 === 0 ? -60 : 60;
        gsap.set(cell, { xPercent: fromX, autoAlpha: 0 });
      });

      // Prepare footer: slightly below and hidden
      if (footer) {
        gsap.set(footer, { yPercent: 40, autoAlpha: 0 });
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.to(header, {
        // Scale up from 50% to 150% in the center
        scale: 1.5,
        duration: 0.85,
        ease: "power3.out",
      });

      // Hold at 150% for ~2 seconds
      tl.add(pauseTween(2));

      tl.to(header, {
        // Move to top while easing back to 100%
        top: 0,
        yPercent: 0,
        scale: 1,
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

      // Fade in main content wrapper so grid/footer are visible for their animations
      tl.add(() => setIntroDone(true));

      // Slide in the four grid cards in parallel (0 & 2 from left, 1 & 3 from right)
      if (cells.length) {
        tl.to(cells, {
          xPercent: 0,
          autoAlpha: 1,
          duration: 1.0,
          ease: "power3.out",
        });
      }

      // Footer rises slightly from bottom and fades in, in parallel with cards
      if (footer) {
        tl.to(
          footer,
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "power2.out",
          },
          "<" // start at same time as cards animation
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
      className="relative flex h-dvh max-h-dvh w-full flex-col overflow-hidden text-foreground"
      style={{
        background: "linear-gradient(116deg, #000A21 3.93%, #0C1A39 34.71%)",
      }}
    >
      <header
        ref={headerRef}
        className={cn(
          "fixed left-0 right-0 top-1/2 z-50 grid -translate-y-1/2 scale-[0.5] transform grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 md:gap-5 md:px-10",
          view.mode !== "grid" &&
            "max-md:bg-gradient-to-b max-md:from-[#0a1225]/92 max-md:from-[28%] max-md:via-[#0a1225]/45 max-md:via-[55%] max-md:to-transparent"
        )}
        style={{ minHeight: "var(--home-header-height)" }}
      >
        <div className="min-w-0" aria-hidden />
        <div
          ref={logoBlockRef}
          className="relative z-[60] flex min-w-0 max-w-2xl shrink-0 flex-col items-center gap-0.5 px-1 text-center sm:px-4"
        >
          {view.mode !== "grid" ? (
            <button
              type="button"
              onClick={() => void collapseToGrid()}
              className="flex w-full cursor-pointer flex-col items-center gap-0.5 rounded-md border-0 bg-transparent p-0 text-inherit outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Back to home"
            >
              <HomeLogoMarkup imageDecorative />
            </button>
          ) : (
            <div className="flex w-full cursor-pointer flex-col items-center gap-0.5">
              <HomeLogoMarkup />
            </div>
          )}
        </div>
        <div
          ref={langSwitcherRef}
          className="pointer-events-none invisible flex min-h-[36px] min-w-0 shrink-0 items-center justify-self-end justify-end self-center pr-0 opacity-0 md:min-w-[88px]"
        >
          <LanguageSwitcher />
        </div>
      </header>

      <div
        className={`flex min-h-0 flex-1 flex-col pt-[var(--home-header-height)] transition-opacity duration-500 ease-out ${
          introDone ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <main className="relative z-10 min-h-0 flex-1 overflow-hidden bg-background">
          {view.mode === "grid" && (
            <div className="absolute inset-0">
              <HomeGrid
                cellRefs={cellRefs}
                stackOrigin={gridStackOrigin}
                onOpenFirm={() =>
                  openFromGrid(
                    { mode: "firm", tab: "overview" },
                    { kind: "cell", index: 0 }
                  )
                }
                onOpenNews={() =>
                  openFromGrid({ mode: "news" }, { kind: "cell", index: 1 })
                }
                onOpenProfessionals={() =>
                  openFromGrid(
                    { mode: "professionals" },
                    { kind: "cell", index: 3 }
                  )
                }
                onOpenExpertise={(slug, innerIndex) =>
                  openFromGrid(
                    { mode: "expertise", slug },
                    { kind: "expertise-tile", innerIndex }
                  )
                }
              />
            </div>
          )}

          {view.mode === "firm" && (
            <div className="absolute inset-0 z-10 flex min-h-0 flex-col">
              <ExpandedFirm
                tab={view.tab}
                onTabChange={(tab) => setView({ mode: "firm", tab })}
                onBack={collapseToGrid}
              />
            </div>
          )}
          {view.mode === "news" && (
            <div className="absolute inset-0 z-10 flex min-h-0 flex-col">
              <ExpandedNewsIndex
                onBack={collapseToGrid}
                onSelectArticle={(id) =>
                  transitionToView({ mode: "news-article", id })
                }
              />
            </div>
          )}
          {view.mode === "news-article" && (
            <div className="absolute inset-0 z-10 flex min-h-0 flex-col">
              <ExpandedNewsArticle
                item={NEWS_ITEMS.find((n) => n.id === view.id) ?? NEWS_ITEMS[0]}
                onBack={collapseToGrid}
                onBackToIndex={() => transitionToView({ mode: "news" })}
                onSelectArticle={(id) =>
                  transitionToView({ mode: "news-article", id })
                }
              />
            </div>
          )}
          {view.mode === "expertise" && (
            <div className="absolute inset-0 z-10 flex min-h-0 flex-col">
              <ExpandedExpertise
                slug={view.slug}
                onBack={collapseToGrid}
                onSelectSlug={(s) =>
                  transitionToView({ mode: "expertise", slug: s })
                }
              />
            </div>
          )}
          {view.mode === "professionals" && (
            <div className="absolute inset-0 z-10 flex min-h-0 flex-col">
              <ExpandedProfessionals onBack={collapseToGrid} />
            </div>
          )}
        </main>

        <div
          ref={footerRef}
          className={cn(view.mode === "firm" && "max-md:hidden")}
        >
          <HomeFooter />
        </div>
      </div>
    </div>
  );
}
