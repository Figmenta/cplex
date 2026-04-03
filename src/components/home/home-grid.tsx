"use client";

import Image from "next/image";
import { useState } from "react";
import { EXPERTISE_ANIMATED_ICON_BY_SLUG } from "@/components/icons/expertise-icon";
import type { ExpertiseSlug } from "./content";
import {
  EXPERTISE_AREAS,
  IMAGE_OUR_PROFESSIONALS,
  IMAGE_THE_FIRM_BUILDING,
} from "./content";
import { HomeNewsMarquee } from "./home-news-marquee";
import { HOME_VT } from "./home-view-transition";

/** Above default cell stacking so the expanding card paints on top (DOM order otherwise favors later cells). */
const EXPAND_LIFT_Z = 30;

function liftForExpand(el: HTMLElement | null) {
  if (!el) return;
  el.style.position = "relative";
  el.style.zIndex = String(EXPAND_LIFT_Z);
}

/** Matches the card/tile we opened from — use on collapse so VT “new” snapshot stacks like expand. */
export type HomeExpandOrigin =
  | { kind: "cell"; index: number }
  | { kind: "expertise-tile"; innerIndex: number };

/** z-index from React state so collapse VT snapshot sees correct stacking (refs/inline after commit are too late). */
function cellStackClass(
  cellIndex: HomeGridCellIndex,
  stackOrigin: HomeExpandOrigin | null
) {
  if (!stackOrigin) return "relative z-[1]";
  if (stackOrigin.kind === "cell" && stackOrigin.index === cellIndex) {
    return "relative z-[30]";
  }
  if (stackOrigin.kind === "expertise-tile" && cellIndex === 2) {
    return "relative z-[30]";
  }
  return "relative z-[1]";
}

function tileStackClass(
  tileIndex: number,
  stackOrigin: HomeExpandOrigin | null
) {
  if (!stackOrigin) return "relative z-[1]";
  if (
    stackOrigin.kind === "expertise-tile" &&
    stackOrigin.innerIndex === tileIndex
  ) {
    return "relative z-[30]";
  }
  return "relative z-[1]";
}

/**
 * During collapse VT, `stackOrigin` is set on the same commit as the grid. If every
 * cell keeps a view-transition-name, the "new" snapshot creates four entering groups
 * that paint above the shared morph — DOM/CSS z-index does not apply to those layers.
 * While `stackOrigin` is set, only the origin element keeps a name; others use `none`
 * so they only participate in the root snapshot.
 */
function vtFirm(stackOrigin: HomeExpandOrigin | null): string {
  if (!stackOrigin) return HOME_VT.firm;
  return stackOrigin.kind === "cell" && stackOrigin.index === 0
    ? HOME_VT.firm
    : "none";
}

function vtNews(stackOrigin: HomeExpandOrigin | null): string {
  if (!stackOrigin) return HOME_VT.news;
  return stackOrigin.kind === "cell" && stackOrigin.index === 1
    ? HOME_VT.news
    : "none";
}

function vtProfessionals(stackOrigin: HomeExpandOrigin | null): string {
  if (!stackOrigin) return HOME_VT.professionals;
  return stackOrigin.kind === "cell" && stackOrigin.index === 3
    ? HOME_VT.professionals
    : "none";
}

function vtExpertiseTile(
  stackOrigin: HomeExpandOrigin | null,
  slug: ExpertiseSlug
): string {
  if (!stackOrigin) return HOME_VT.expertise(slug);
  if (stackOrigin.kind !== "expertise-tile") return "none";
  const originSlug = EXPERTISE_AREAS[stackOrigin.innerIndex]?.slug;
  return originSlug === slug ? HOME_VT.expertise(slug) : "none";
}

/** 0 firm | 1 news | 2 expertise | 3 professionals */
export type HomeGridCellIndex = 0 | 1 | 2 | 3;

type HomeGridProps = {
  cellRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  /** Set during collapse VT so the incoming “new” snapshot stacks the returning card above siblings. */
  stackOrigin: HomeExpandOrigin | null;
  onOpenFirm: () => void;
  onOpenNews: () => void;
  onOpenProfessionals: () => void;
  onOpenExpertise: (slug: ExpertiseSlug, innerIndex: number) => void;
};

export function HomeGrid({
  cellRefs,
  stackOrigin,
  onOpenFirm,
  onOpenNews,
  onOpenProfessionals,
  onOpenExpertise,
}: HomeGridProps) {
  const setCellRef = (index: HomeGridCellIndex) => (el: HTMLElement | null) => {
    cellRefs.current[index] = el;
  };

  const [hoveredExpertiseSlug, setHoveredExpertiseSlug] =
    useState<ExpertiseSlug | null>(null);

  return (
    <div
      className="relative grid h-full min-h-0 w-full grid-cols-2 gap-0 border border-border/15 max-md:[grid-template-areas:'firm_prof'_'expertise_expertise'_'news_news'] max-md:[grid-template-rows:minmax(0,1fr)_auto_auto] md:[grid-template-areas:'firm_news'_'expertise_professionals'] md:grid-rows-2"
    >
      {/* The Firm — desktop top-left | mobile top-left */}
      <button
        type="button"
        ref={setCellRef(0)}
        onClick={(e) => {
          liftForExpand(e.currentTarget);
          onOpenFirm();
        }}
        style={{ viewTransitionName: vtFirm(stackOrigin) }}
        className={`[grid-area:firm] cursor-pointer group ${cellStackClass(0, stackOrigin)} flex min-h-0 flex-col overflow-hidden rounded-none border-r border-b border-border/15 text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring`}
      >
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={IMAGE_THE_FIRM_BUILDING}
            alt="CP LEX office building exterior"
            fill
            className="object-cover object-center transition-all duration-300 brightness-[0.8] saturate-[0.50]  group-hover:saturate-[1]"
            sizes="(max-width: 767px) 50vw, 50vw"
            priority
          />
          <div
            className="absolute inset-0 opacity-50 sm:opacity-0 transition-opacity duration-300 group-hover:opacity-50"
            aria-hidden
            style={{
              background:
                "linear-gradient(123.18deg, #000a21 3.93%, #0c1a39 34.71%)",
            }}
          />
        </div>
        <span className="relative z-10 mt-auto px-3 pb-3 pt-0 font-montserrat text-[14px] font-bold uppercase tracking-[0.35em] text-section-heading md:mt-0 md:px-5 md:pb-3 md:pt-5 md:text-[16px]">
          The Firm
        </span>
        <p className="relative z-10 mt-auto max-md:hidden max-w-full translate-y-2 px-5 pb-5 pt-4 text-[10px] leading-snug text-foreground opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 md:block md:text-[11px]">
          CP | LEX is a boutique law firm delivering sophisticated legal
          solutions.
        </p>
      </button>

      {/* Our News — desktop top-right | mobile full-width row 3 */}
      <div
        ref={setCellRef(1)}
        role="button"
        tabIndex={0}
        onClick={(e) => {
          liftForExpand(e.currentTarget);
          onOpenNews();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            liftForExpand(e.currentTarget);
            onOpenNews();
          }
        }}
        style={{ viewTransitionName: vtNews(stackOrigin) }}
        className={`[grid-area:news] max-md:shrink-0 cursor-pointer group ${cellStackClass(1, stackOrigin)} flex min-h-0 flex-col overflow-hidden rounded-none border-border/15 bg-background text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring md:border-b`}
      >
        <span className="shrink-0 px-4 pb-4 pt-6 text-left font-montserrat text-[10px] font-bold uppercase tracking-[0.35em] text-section-heading md:px-5 md:pb-1 md:pt-5 md:text-[16px]">
          Our News
        </span>
        <div
          className="pb-4 flex min-h-0 w-full flex-col max-md:flex-none max-md:shrink-0 md:flex-1"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <HomeNewsMarquee compact interactive={false} />
        </div>
      </div>

      {/* Areas of expertise — desktop bottom-left | mobile row 2 full width */}
      <div
        ref={setCellRef(2)}
        className={`[grid-area:expertise] max-md:shrink-0 cursor-pointer ${cellStackClass(2, stackOrigin)} flex min-h-0 flex-col overflow-hidden rounded-none border-b border-border/15 md:border-b-0 md:border-r md:border-border/15`}
      >
        <span className="shrink-0 px-4 pb-3 pt-6 font-montserrat text-[11px] font-bold uppercase tracking-[0.35em] text-section-heading md:px-5 md:pb-2 md:pt-5 md:text-[16px]">
          Areas of expertise
        </span>
        <div
          className="grid min-h-0 shrink-0 grid-cols-4 grid-rows-1 gap-1 px-1 pb-1 md:min-h-0 md:flex-1 md:grid-cols-2 md:grid-rows-2 md:gap-0 md:px-0 md:pb-0"
          onMouseLeave={() => setHoveredExpertiseSlug(null)}
        >
          {EXPERTISE_AREAS.map((area, tileIndex) => {
            const ExpertiseIcon = EXPERTISE_ANIMATED_ICON_BY_SLUG[area.slug];
            const labelMobile = area.labelShort ?? area.label;
            return (
              <button
                key={area.slug}
                type="button"
                onMouseEnter={() => setHoveredExpertiseSlug(area.slug)}
                onClick={(e) => {
                  e.stopPropagation();
                  liftForExpand(e.currentTarget);
                  liftForExpand(cellRefs.current[2]);
                  onOpenExpertise(area.slug, tileIndex);
                }}
                style={{
                  viewTransitionName: vtExpertiseTile(stackOrigin, area.slug),
                }}
                className={`cursor-pointer group flex min-h-0 min-w-0 flex-col items-center justify-center rounded-md px-0.5 py-1 text-center outline-none transition-colors gap-2 md:rounded-none md:bg-background md:px-1 md:py-3 ${tileStackClass(tileIndex, stackOrigin)}`}
              >
                <div className="flex h-10 w-10 p-1 md:p-0 shrink-0 items-center justify-center rounded-md bg-[#FFFFFF0A]  border border-[#FFFFFF0F] md:border-none transition-transform duration-200 group-hover:scale-110 md:h-14 md:w-14 md:rounded-none md:bg-transparent">
                  <ExpertiseIcon
                    isHovered={hoveredExpertiseSlug === area.slug}
                  />
                </div>
                <span className="line-clamp-2 w-full px-0.5 font-montserrat text-[9px] md:font-medium leading-[135%] text-white transition-all duration-300 group-hover:text-white max-md:min-h-0 md:min-h-0 md:text-[10px] md:text-[#666] md:leading-tight">
                  <span className="md:hidden">{labelMobile}</span>
                  <span className="hidden md:inline">{area.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* The Professionals — desktop bottom-right | mobile top-right */}
      <button
        type="button"
        ref={setCellRef(3)}
        onClick={(e) => {
          liftForExpand(e.currentTarget);
          onOpenProfessionals();
        }}
        style={{ viewTransitionName: vtProfessionals(stackOrigin) }}
        className={`max-md:[grid-area:prof] md:[grid-area:professionals] cursor-pointer group ${cellStackClass(3, stackOrigin)} flex min-h-0 flex-col overflow-hidden rounded-none border-b border-border/15 text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring md:border-b-0`}
      >
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={IMAGE_OUR_PROFESSIONALS}
            alt="CP LEX legal professionals"
            fill
            className="object-cover object-[center_20%] transition-all duration-300 brightness-[0.8] saturate-[0.50] group-hover:saturate-[1]"
            sizes="(max-width: 767px) 50vw, 50vw"
          />
          <div
            className="absolute inset-0 opacity-50 sm:opacity-0 transition-opacity duration-300 group-hover:opacity-50"
            aria-hidden
            style={{
              background:
                "linear-gradient(123.18deg, #000a21 3.93%, #0c1a39 34.71%)",
            }}
          />
        </div>
        <span className="relative z-10 mt-auto px-3 pb-3 pt-0 font-montserrat text-[14px] font-bold uppercase tracking-[0.35em] text-section-heading md:mt-0 md:px-5 md:pb-3 md:pt-5 md:text-[16px]">
          The Professionals
        </span>
        <p className="relative z-10 mt-auto max-md:hidden max-w-full translate-y-2 px-5 pb-5 pt-4 text-[10px] leading-snug text-foreground opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 md:block md:text-[11px]">
          Meet our team of legal experts
        </p>
      </button>
    </div>
  );
}
