"use client";

import Image from "next/image";
import type { ExpertiseSlug } from "./content";
import {
  EXPERTISE_AREAS,
  IMAGE_OUR_PROFESSIONALS,
  IMAGE_THE_FIRM_BUILDING,
} from "./content";
import { HOME_VT } from "./home-view-transition";

/** 0 firm | 1 news | 2 expertise | 3 professionals */
export type HomeGridCellIndex = 0 | 1 | 2 | 3;

type HomeGridProps = {
  cellRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  expertiseTileRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  onOpenFirm: () => void;
  onOpenNews: () => void;
  onOpenProfessionals: () => void;
  onOpenExpertise: (slug: ExpertiseSlug, innerIndex: number) => void;
};

export function HomeGrid({
  cellRefs,
  expertiseTileRefs,
  onOpenFirm,
  onOpenNews,
  onOpenProfessionals,
  onOpenExpertise,
}: HomeGridProps) {
  const setCellRef = (index: HomeGridCellIndex) => (el: HTMLElement | null) => {
    cellRefs.current[index] = el;
  };

  const setTileRef =
    (index: number) => (el: HTMLElement | null) => {
      expertiseTileRefs.current[index] = el;
    };

  return (
    <div className="grid h-full min-h-0 w-full grid-cols-2 grid-rows-2 gap-0 border border-border/15">
      {/* The Firm — top left */}
      <button
        type="button"
        ref={setCellRef(0)}
        onClick={onOpenFirm}
        style={{ viewTransitionName: HOME_VT.firm }}
        className="group relative flex min-h-0 flex-col overflow-hidden rounded-md border-r border-b border-border/15 text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={IMAGE_THE_FIRM_BUILDING}
            alt="CP LEX office building exterior"
            fill
            className="object-cover object-center brightness-[0.65] saturate-[0.85]"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-background/35" aria-hidden />
        </div>
        <span className="relative z-10 px-5 pb-3 pt-5 font-montserrat text-[11px] font-semibold uppercase tracking-[0.35em] text-section-heading md:text-sm">
          The Firm
        </span>
        <p className="relative z-10 mt-auto max-w-[min(100%,20rem)] px-5 pb-5 text-[10px] leading-snug text-foreground md:text-xs">
          CP | LEX is a boutique law firm delivering sophisticated legal solutions.
        </p>
      </button>

      {/* Our News — top right */}
      <button
        type="button"
        ref={setCellRef(1)}
        onClick={onOpenNews}
        style={{ viewTransitionName: HOME_VT.news }}
        className="group relative flex min-h-0 flex-col overflow-hidden rounded-md border-b border-border/15 bg-background text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="px-5 pb-2 pt-5 font-montserrat text-[11px] font-semibold uppercase tracking-[0.35em] text-section-heading md:text-sm">
          Our News
        </span>
        <p className="line-clamp-4 px-5 text-[10px] leading-snug text-foreground/90 md:text-xs">
          Orion Capital completed a strategic minority investment in NovaGrid
          Technologies, a European developer of smart energy infrastructure. CP
          LEX advised the investor on the transaction and related corporate
          matters.
        </p>
        <p className="mt-2 px-5 text-[9px] uppercase tracking-wide text-news-accent md:text-[10px]">
          March 12, 2027
        </p>
      </button>

      {/* Areas of expertise — bottom left (outer cell does not expand; inner tiles do) */}
      <div
        ref={setCellRef(2)}
        className="relative flex min-h-0 flex-col overflow-hidden rounded-md border-r border-border/15 bg-background"
      >
        <span className="px-5 pb-2 pt-5 font-montserrat text-[11px] font-semibold uppercase tracking-[0.35em] text-section-heading md:text-sm">
          Areas of expertise
        </span>
        <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-px bg-border/20 p-px">
          {EXPERTISE_AREAS.map((area, tileIndex) => (
            <button
              key={area.slug}
              type="button"
              ref={setTileRef(tileIndex)}
              onClick={(e) => {
                e.stopPropagation();
                onOpenExpertise(area.slug, tileIndex);
              }}
              style={{ viewTransitionName: HOME_VT.expertise(area.slug) }}
              className="flex min-h-0 flex-col items-center justify-center gap-2 rounded-sm bg-background px-1 py-2 text-center outline-none transition-colors hover:bg-muted/20 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Image
                src={area.icon}
                alt=""
                width={56}
                height={56}
                className="h-10 w-10 md:h-14 md:w-14"
              />
              <span className="font-montserrat text-[8px] font-medium leading-tight text-foreground md:text-[10px]">
                {area.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* The Professionals — bottom right */}
      <button
        type="button"
        ref={setCellRef(3)}
        onClick={onOpenProfessionals}
        style={{ viewTransitionName: HOME_VT.professionals }}
        className="group relative flex min-h-0 flex-col overflow-hidden rounded-md text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={IMAGE_OUR_PROFESSIONALS}
            alt="CP LEX legal professionals"
            fill
            className="object-cover object-[center_20%] brightness-[0.7] saturate-[0.8]"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-background/40" aria-hidden />
        </div>
        <span className="relative z-10 px-5 pb-3 pt-5 font-montserrat text-[11px] font-semibold uppercase tracking-[0.35em] text-section-heading md:text-sm">
          The Professionals
        </span>
        <p className="relative z-10 mt-auto px-5 pb-5 text-[10px] leading-snug text-foreground md:text-xs">
          Meet our team of legal experts
        </p>
      </button>
    </div>
  );
}
