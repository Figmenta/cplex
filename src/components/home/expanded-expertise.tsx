import { ExpertiseSlug } from "./content";
import { EXPERTISE_AREAS, EXPERTISE_COPY } from "./content";
import { EXPERTISE_ANIMATED_ICON_BY_SLUG } from "@/components/icons/expertise-icon";
import { useState, useEffect } from "react";
import { HOME_VT } from "./home-view-transition";
import { BackButton } from "./back-button";
import { cn } from "@/lib/utils";
import { SUBNAV_MIN_STYLE } from "@/constant/variabls";

export function ExpandedExpertise({
  slug,
  onBack,
  onSelectSlug,
}: {
  slug: ExpertiseSlug;
  onBack: () => void;
  onSelectSlug: (s: ExpertiseSlug) => void;
}) {
  const area = EXPERTISE_AREAS.find((a) => a.slug === slug)!;
  const copy = EXPERTISE_COPY[slug];
  const HeroIcon = EXPERTISE_ANIMATED_ICON_BY_SLUG[slug];
  const [hoveredNavSlug, setHoveredNavSlug] = useState<ExpertiseSlug | null>(
    null
  );

  useEffect(() => {
    setHoveredNavSlug(null);
  }, [slug]);

  return (
    <div
      className="relative flex h-full min-h-0 flex-col"
      style={{ viewTransitionName: HOME_VT.expertise(slug), borderRadius: 0 }}
    >
      {/* Hero fills the panel only; copy scrolls independently on top (image does not move with scroll) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-background">
        {/* <Image
            src={IMAGE_EXPERTISE_HERO}
            alt=""
            fill
            className="object-cover object-[center_30%] brightness-[0.45]"
            sizes="100vw"
            priority
          /> */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-background/92 via-background/65 to-transparent" /> */}
      </div>

      {/* Main content: title, Overview, Services, Approach */}
      <div className="relative z-10 flex min-h-0 max-w-[900px] flex-1 flex-col overflow-y-auto overscroll-contain [scrollbar-width:none]">
        <div className="flex w-full flex-col items-start px-6 pb-8 pt-10 md:px-10 md:pb-24">
          <div className="mb-6 flex flex-col items-start gap-4">
            <div className="h-14 w-14 shrink-0 md:h-16 md:w-16">
              <HeroIcon isHovered={false} />
            </div>
            <h2 className="font-montserrat font-semibold leading-tight text-foreground text-[32px]">
              {area.label}
            </h2>
          </div>
          <div className="w-full space-y-6 text-base leading-relaxed text-foreground/95 md:text-base">
            <section>
              <h3 className="mb-2 text-[13px] font-semibold text-foreground">
                Overview
              </h3>
              <p className="text-[16px]">{copy.overview}</p>
            </section>
            <section>
              <h3 className="mb-2 text-[13px] font-semibold text-foreground">
                Services
              </h3>
              <p className="text-[16px]">{copy.services}</p>
            </section>
            <section>
              <h3 className="mb-2 text-[13px] font-semibold text-foreground">
                Approach
              </h3>
              <p className="text-[16px]">{copy.approach}</p>
            </section>
          </div>
        </div>

        {/* Mobile: expertise selector as a section below main content (matches home-grid mobile) */}
        <div className="flex w-full flex-col gap-1 px-2 pt-6 pb-24 md:hidden">
          <span className="shrink-0 px-2 pb-3 pt-2 font-montserrat text-[14px] text-center font-bold uppercase tracking-[0.35em] text-white">
            Areas of expertise
          </span>
          <div className="grid grid-cols-4 grid-rows-1 gap-1">
            {EXPERTISE_AREAS.map((a) => {
              const NavIcon = EXPERTISE_ANIMATED_ICON_BY_SLUG[a.slug];
              const isActive = a.slug === slug;
              const labelMobile = a.labelShort ?? a.label;
              return (
                <button
                  key={a.slug}
                  type="button"
                  onClick={() => onSelectSlug(a.slug)}
                  className={cn(
                    "cursor-pointer group flex min-h-0 min-w-0 flex-col items-center justify-center rounded-md px-0.5 py-1 text-center outline-none transition-colors gap-2"
                    // isActive ? "bg-[#0B1931]" : ""
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 p-1 shrink-0 items-center justify-center rounded-md  border border-[#FFFFFF0F]",
                      isActive ? "bg-[#0c2247]" : "bg-[#FFFFFF0A]"
                    )}
                  >
                    <NavIcon isHovered={isActive} />
                  </div>
                  <span className="line-clamp-2 w-full px-0.5 font-montserrat text-[9px] leading-[135%] text-white">
                    {labelMobile}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom nav: back button + (desktop only) horizontal expertise tabs */}
      <nav
        data-expertise-footer-nav
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col bg-transparent"
        aria-label="Practice areas"
      >
        <div
          className="pointer-events-auto flex w-full shrink-0 items-stretch overflow-hidden bg-[#121111] px-6 md:px-10"
          style={SUBNAV_MIN_STYLE}
          onMouseLeave={() => setHoveredNavSlug(null)}
        >
          <BackButton
            onClick={onBack}
            className="min-h-0 shrink-0 self-stretch rounded-none border-r border-white/10 px-3 py-0 text-white md:border-0 md:pr-8"
          />
          {/* Desktop only: horizontal scrollable expertise tabs */}
          <div className="hidden md:flex min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex h-full min-h-0 min-w-max flex-nowrap items-stretch gap-x-1 px-1 md:min-w-0 md:flex-1 md:flex-wrap md:gap-x-3 md:gap-y-0 md:px-4 md:pl-2">
              {EXPERTISE_AREAS.map((a) => {
                const NavIcon = EXPERTISE_ANIMATED_ICON_BY_SLUG[a.slug];
                const isActive = a.slug === slug;
                const navActive = isActive || hoveredNavSlug === a.slug;
                const label = a.labelShort ?? a.label;
                return (
                  <button
                    key={a.slug}
                    type="button"
                    onMouseEnter={() => setHoveredNavSlug(a.slug)}
                    onClick={() => onSelectSlug(a.slug)}
                    className={cn(
                      "cursor-pointer flex min-h-0 shrink-0 items-center justify-center gap-1.5 self-stretch px-2.5 text-[10px] uppercase tracking-wide transition-colors md:min-w-0 md:px-3 md:text-[11px]",
                      "text-white",
                      isActive ? "bg-[#0B1931] font-semibold" : "font-normal"
                    )}
                  >
                    <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center md:h-4 md:w-4">
                      <NavIcon isHovered={navActive} />
                    </span>
                    <span className="text-nowrap">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
