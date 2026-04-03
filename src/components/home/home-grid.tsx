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
    <div className="relative grid h-full min-h-0 w-full grid-cols-2 grid-rows-2 gap-0 border border-border/15">
      {/* The Firm — top left */}
      <button
        type="button"
        ref={setCellRef(0)}
        onClick={(e) => {
          liftForExpand(e.currentTarget);
          onOpenFirm();
        }}
        style={{ viewTransitionName: vtFirm(stackOrigin) }}
        className={`cursor-pointer group ${cellStackClass(0, stackOrigin)} flex min-h-0 flex-col overflow-hidden rounded-none border-r border-b border-border/15 text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring`}
      >
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={IMAGE_THE_FIRM_BUILDING}
            alt="CP LEX office building exterior"
            fill
            className="object-cover object-center transition-all duration-300 brightness-[0.8] saturate-[0.50] group-hover:brightness-[0.8] group-hover:saturate-[1]"
            sizes="50vw"
            priority
          />
          <div
            className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-50 "
            aria-hidden
            style={{
              background:
                "linear-gradient(123.18deg, #000a21 3.93%, #0c1a39 34.71%)",
            }}
          />
        </div>
        <span className="relative z-10 px-5 pb-3 pt-5 font-montserrat text-[11px] font-bold uppercase tracking-[0.35em] text-section-heading md:text-[16px]">
          The Firm
        </span>
        <p className="relative z-10 mt-auto translate-y-2 px-5 pb-5 text-[10px] leading-snug text-foreground opacity-0 pt-4 group-hover:opacity-100 group-hover:translate-y-0 duration-300 ease-out md:text-[11px]">
          CP | LEX is a boutique law firm delivering sophisticated legal
          solutions.
        </p>
      </button>

      {/* Our News — top right (div: marquee is scrollable; nested buttons invalid inside <button>) */}
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
        className={`cursor-pointer group ${cellStackClass(1, stackOrigin)} flex min-h-0 flex-col overflow-hidden rounded-none border-b border-border/15 bg-background text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring`}
      >
        <span className="shrink-0 px-5 pb-1 pt-5 font-montserrat text-[11px] font-bold uppercase tracking-[0.35em] text-section-heading md:text-[16px]">
          Our News
        </span>
        <HomeNewsMarquee compact interactive={false} />
      </div>

      {/* Areas of expertise — bottom left (outer cell does not expand; inner tiles do) */}
      <div
        ref={setCellRef(2)}
        className={`cursor-pointer ${cellStackClass(2, stackOrigin)} flex min-h-0 flex-col overflow-hidden rounded-none`}
      >
        <span className="px-5 pb-2 pt-5 font-montserrat text-[11px] font-bold uppercase tracking-[0.35em] text-section-heading md:text-[16px]">
          Areas of expertise
        </span>
        <div
          className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2"
          onMouseLeave={() => setHoveredExpertiseSlug(null)}
        >
          {EXPERTISE_AREAS.map((area, tileIndex) => {
            const ExpertiseIcon = EXPERTISE_ANIMATED_ICON_BY_SLUG[area.slug];
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
                className={`group cursor-pointer flex min-h-0 flex-col items-center justify-center gap-2 rounded-none bg-background px-1 py-3 text-center outline-none transition-colors ${tileStackClass(tileIndex, stackOrigin)}`}
              >
                <div className="h-10 w-10 transition-transform duration-200 group-hover:scale-110 md:h-14 md:w-14">
                  <ExpertiseIcon
                    isHovered={hoveredExpertiseSlug === area.slug}
                  />
                </div>
                <span className="font-montserrat text-[8px] font-medium leading-tight text-[#666] group-hover:text-white duration-300 transition-all md:text-[10px]">
                  {area.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* The Professionals — bottom right */}
      <button
        type="button"
        ref={setCellRef(3)}
        onClick={(e) => {
          liftForExpand(e.currentTarget);
          onOpenProfessionals();
        }}
        style={{ viewTransitionName: vtProfessionals(stackOrigin) }}
        className={`cursor-pointer group ${cellStackClass(3, stackOrigin)} flex min-h-0 flex-col overflow-hidden rounded-none text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring`}
      >
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={IMAGE_OUR_PROFESSIONALS}
            alt="CP LEX legal professionals"
            fill
            className="object-cover object-[center_20%] transition-all duration-300 brightness-[0.8] saturate-[0.50] group-hover:brightness-[0.8] group-hover:saturate-[1]"
            sizes="50vw"
          />
          <div
            className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-50 "
            aria-hidden
            style={{
              background:
                "linear-gradient(123.18deg, #000a21 3.93%, #0c1a39 34.71%)",
            }}
          />
        </div>
        <span className="relative z-10 px-5 pb-3 pt-5 font-montserrat text-[11px] font-bold uppercase tracking-[0.35em] text-section-heading md:text-[16px]">
          The Professionals
        </span>
        <p className="relative z-10 mt-auto translate-y-2 px-5 pb-5 text-[10px] leading-snug text-foreground opacity-0 pt-4 group-hover:opacity-100 group-hover:translate-y-0 duration-300 ease-out md:text-[11px]">
          Meet our team of legal experts
        </p>
      </button>
    </div>
  );
}
