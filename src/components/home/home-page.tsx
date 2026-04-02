"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { FIRM_TABS } from "./content";
import type { ExpertiseSlug } from "./content";
import { NEWS_ITEMS, expertiseSlugToIndex } from "./content";
import {
  ExpandedExpertise,
  ExpandedFirm,
  ExpandedNewsArticle,
  ExpandedNewsIndex,
  ExpandedProfessionals,
} from "./home-expanded";
import { HomeFooter } from "./home-footer";
import { HomeGrid } from "./home-grid";
import { startHomeViewTransition } from "./home-view-transition";

const pauseTween = (duration: number) =>
  gsap.to({ t: 0 }, { t: 1, duration, ease: "none" });

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
  const langSwitcherRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLElement | null)[]>([null, null, null, null]);
  const expertiseTileRefs = useRef<(HTMLElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const busyRef = useRef(false);
  const originRef = useRef<GridOrigin>({ kind: "cell", index: 0 });
  const [introDone, setIntroDone] = useState(false);
  const [view, setView] = useState<HomeView>({ mode: "grid" });

  useEffect(() => {
    if (view.mode !== "expertise") return;
    originRef.current = {
      kind: "expertise-tile",
      innerIndex: expertiseSlugToIndex(view.slug),
    };
  }, [view]);

  const runViewTransition = useCallback(
    (update: () => void) => {
      if (busyRef.current) return;
      busyRef.current = true;
      void startHomeViewTransition(update).finally(() => {
        busyRef.current = false;
      });
    },
    []
  );

  const openFromGrid = useCallback(
    (next: HomeView, origin: GridOrigin) => {
      runViewTransition(() => {
        originRef.current = origin;
        setView(next);
      });
    },
    [runViewTransition]
  );

  const collapseToGrid = useCallback(() => {
    runViewTransition(() => {
      setView({ mode: "grid" });
    });
  }, [runViewTransition]);

  const transitionToView = useCallback((next: HomeView) => {
    void startHomeViewTransition(() => {
      setView(next);
    });
  }, []);

  useGSAP(
    () => {
      const header = headerRef.current;
      const langSwitcher = langSwitcherRef.current;
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

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => setIntroDone(true),
      });

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
      className="relative flex h-dvh max-h-dvh w-full flex-col overflow-hidden bg-background text-foreground"
    >
      <header
        ref={headerRef}
        className="fixed left-0 right-0 top-1/2 z-50 flex -translate-y-1/2 scale-[0.5] transform items-center justify-between gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 md:gap-5 md:px-10"
        style={{ minHeight: "var(--home-header-height)" }}
      >
        <div className="min-w-0 flex-1" aria-hidden />
        <div className="flex w-full min-w-0 max-w-2xl shrink-0 flex-col items-center gap-0.5 px-2 text-center sm:px-4">
          <Image
            src="/logo.svg"
            alt="CP | LEX"
            width={800}
            height={800}
            className="h-7 w-auto max-w-full select-none md:h-8"
          />
          <p className="font-montserrat text-[8px] font-medium leading-tight tracking-wide text-foreground md:leading-snug">
            Justice, Integrity, and Excellence in Practice
          </p>
          <p className="text-[7px] font-light leading-tight tracking-[0.2em] uppercase">
            EST. 1985
          </p>
        </div>
        <div
          ref={langSwitcherRef}
          className="pointer-events-none invisible flex min-h-[36px] min-w-[72px] flex-1 items-center justify-end md:min-w-[88px]"
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
                expertiseTileRefs={expertiseTileRefs}
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
                  openFromGrid({ mode: "professionals" }, { kind: "cell", index: 3 })
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
                item={
                  NEWS_ITEMS.find((n) => n.id === view.id) ?? NEWS_ITEMS[0]
                }
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
                onSelectSlug={(slug) =>
                  transitionToView({ mode: "expertise", slug })
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

        <HomeFooter />
      </div>
    </div>
  );
}
