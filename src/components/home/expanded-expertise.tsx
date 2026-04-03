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
      <div className="relative z-10 flex min-h-0 max-w-[900px] flex-1 flex-col overflow-y-auto overscroll-contain [scrollbar-width:none]">
        <div className="flex w-full flex-col items-start px-6 pb-24 pt-10 md:px-10">
          <div className="mb-6 flex flex-col items-start gap-4">
            <div className="h-14 w-14 shrink-0 md:h-16 md:w-16">
              <HeroIcon isHovered={false} />
            </div>
            <h2 className="font-montserrat text-2xl font-semibold leading-tight text-foreground md:text-[32px]">
              {area.label}
            </h2>
          </div>
          <div className="w-full space-y-6 text-base leading-relaxed text-foreground/95 md:text-base">
            <section>
              <h3 className="mb-2 font-semibold text-foreground">Overview</h3>
              <p>{copy.overview}</p>
            </section>
            <section>
              <h3 className="mb-2 font-semibold text-foreground">Services</h3>
              <p>{copy.services}</p>
            </section>
            <section>
              <h3 className="mb-2 font-semibold text-foreground">Approach</h3>
              <p>{copy.approach}</p>
            </section>
          </div>
        </div>
      </div>
      <nav
        data-expertise-footer-nav
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col bg-transparent"
        aria-label="Practice areas"
      >
        <div
          className="pointer-events-auto flex w-full shrink-0 items-stretch overflow-hidden bg-[#121111]"
          style={SUBNAV_MIN_STYLE}
          onMouseLeave={() => setHoveredNavSlug(null)}
        >
          <BackButton
            onClick={onBack}
            className="min-h-0 shrink-0 self-stretch rounded-none border-r border-white/10 px-3 py-0 text-white"
          />
          <div className="min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] md:overflow-visible [&::-webkit-scrollbar]:hidden">
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
