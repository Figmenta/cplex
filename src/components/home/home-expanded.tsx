"use client";

import Image from "next/image";
import {
  EXPERTISE_AREAS,
  EXPERTISE_COPY,
  FIRM_TABS,
  IMAGE_EXPERTISE_HERO,
  IMAGE_THE_FIRM_BUILDING,
  IMAGE_OUR_PROFESSIONALS,
  NEWS_ITEMS,
  type ExpertiseSlug,
  type NewsItem,
} from "./content";
import { HOME_VT } from "./home-view-transition";

const sectionTitle =
  "font-montserrat text-lg font-bold uppercase tracking-[0.35em] text-section-heading md:text-[24px]";

export function ExpandedFirm({
  onBack,
  tab,
  onTabChange,
}: {
  onBack: () => void;
  tab: (typeof FIRM_TABS)[number]["id"];
  onTabChange: (id: (typeof FIRM_TABS)[number]["id"]) => void;
}) {
  const copy: Record<(typeof FIRM_TABS)[number]["id"], string> = {
    overview:
      "CP | LEX is a boutique law firm delivering sophisticated legal solutions.",
    approach:
      "We combine technical excellence with commercial judgment, working in small partner-led teams aligned to each client's objectives.",
    international:
      "We coordinate cross-border mandates with trusted counsel worldwide, focusing on practical execution and regulatory alignment.",
    challenges:
      "We specialise in complex, high-stakes matters where precision, timing, and strategic positioning are decisive.",
  };

  return (
    <div
      className="relative flex h-full min-h-0 flex-col"
      style={{ viewTransitionName: HOME_VT.firm }}
    >
      {/* Full-bleed hero: image fills main area; copy overlaid on the left */}
      <div className="relative min-h-0 flex-1 overflow-y-auto">
        <div className="relative min-h-full w-full">
          <Image
            src={IMAGE_THE_FIRM_BUILDING}
            alt="CP LEX headquarters"
            fill
            className="object-cover object-center brightness-[0.55] saturate-[0.85]"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/55 to-background/25" />
          <div className="absolute inset-0 flex flex-col justify-between px-6 py-10 md:max-w-[min(100%,520px)] md:px-12 lg:max-w-[560px]">
            <h2 className={sectionTitle}>The Firm</h2>
            <p className="mt-6 text-sm text-foreground md:text-[27px] leading-[155%]">
              {copy[tab]}
            </p>
            {/* empty div to push the content down */}
            <div className="h-10" />
          </div>
        </div>
      </div>
      <nav
        className="flex shrink-0 flex-wrap items-center gap-2 border-t border-border/20 bg-background px-4 py-2 md:gap-6 md:px-8"
        style={{ minHeight: "var(--home-subnav-height)" }}
        aria-label="Firm sections"
      >
        <BackButton onClick={onBack} />
        {FIRM_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
            className={`text-[10px] uppercase tracking-wide transition-colors md:text-xs ${
              tab === t.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/90"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function VerticalNewsMarquee({
  onSelect,
  highlightId,
}: {
  onSelect: (id: string) => void;
  highlightId?: string;
}) {
  const loop = [...NEWS_ITEMS, ...NEWS_ITEMS];
  return (
    <div className="group relative min-h-0 flex-1 overflow-hidden px-4 py-2 md:px-10">
      <div
        className="marquee-vertical-news group flex flex-col gap-6 md:gap-8"
        style={{ willChange: "transform" }}
      >
        {loop.map((item, idx) => {
          const isHighlight = item.id === highlightId;
          return (
            <button
              key={`${item.id}-${idx}`}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`w-full max-w-3xl rounded-sm border text-left outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring ${
                isHighlight
                  ? "border-border/40 bg-muted/25 px-4 py-3"
                  : "border-transparent px-4 py-2 opacity-80 hover:opacity-100"
              }`}
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-news-accent md:text-xs">
                {item.date}
              </p>
              <p className="mt-2 text-xs leading-snug text-foreground md:text-sm">
                {item.title}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ExpandedNewsIndex({
  onBack,
  onSelectArticle,
}: {
  onBack: () => void;
  onSelectArticle: (id: string) => void;
}) {
  const highlightId = "helios-atlas";

  return (
    <div
      className="flex h-full min-h-0 flex-col bg-background"
      style={{ viewTransitionName: HOME_VT.news }}
    >
      <div className="shrink-0 px-5 pt-5 md:px-10">
        <h2 className={sectionTitle}>Our News</h2>
      </div>
      <VerticalNewsMarquee
        onSelect={onSelectArticle}
        highlightId={highlightId}
      />
      <nav
        className="flex shrink-0 items-center border-t border-border/20 bg-background px-4 py-2 md:px-8"
        style={{ minHeight: "var(--home-subnav-height)" }}
      >
        <BackButton onClick={onBack} />
      </nav>
    </div>
  );
}

export function ExpandedNewsArticle({
  item,
  onBack,
  onBackToIndex,
  onSelectArticle,
}: {
  item: NewsItem;
  onBack: () => void;
  onBackToIndex: () => void;
  onSelectArticle: (id: string) => void;
}) {
  const others = NEWS_ITEMS.filter((n) => n.id !== item.id).slice(0, 4);

  return (
    <div
      className="flex h-full min-h-0 flex-col bg-background"
      style={{ viewTransitionName: HOME_VT.news }}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <article className="popup-scroll flex min-h-0 min-w-0 flex-[1.7] flex-col overflow-y-auto border-border/15 md:border-r">
          <div className="px-5 pt-5 md:px-10">
            <h2 className={sectionTitle}>Our News</h2>
            <p className="mt-4 text-[10px] uppercase tracking-wider text-news-accent md:text-xs">
              {item.date}
            </p>
            <h3 className="mt-3 max-w-4xl font-serif text-xl font-medium leading-snug text-foreground md:text-2xl">
              {item.title}
            </h3>
          </div>
          <div className="relative mt-4 aspect-[21/9] w-full shrink-0 px-5 md:px-10">
            <Image
              src={item.imageSrc}
              alt={item.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 70vw"
            />
          </div>
          <div className="max-w-4xl px-5 py-6 text-sm leading-relaxed text-foreground/95 md:px-10 md:text-base">
            {item.body.split("\n\n").map((p) => (
              <p key={p.slice(0, 24)} className="mb-4">
                {p}
              </p>
            ))}
          </div>
        </article>
        <aside className="popup-scroll flex max-h-[36vh] min-h-0 w-full shrink-0 flex-col border-t border-border/15 bg-card/40 md:max-h-none md:w-[30%] md:border-t-0 md:py-6">
          <h4 className="px-5 pt-4 font-serif text-base text-foreground md:px-6">
            Other news
          </h4>
          <ul className="flex flex-col gap-4 px-5 pb-6 pt-3 md:px-6">
            {others.map((n) => (
              <li
                key={n.id}
                className="border-b border-border/10 pb-3 last:border-0"
              >
                <button
                  type="button"
                  onClick={() => onSelectArticle(n.id)}
                  className="w-full text-left text-xs text-foreground hover:underline md:text-sm"
                >
                  {n.title.length > 90 ? `${n.title.slice(0, 90)}…` : n.title}
                </button>
                <p className="mt-1 text-[9px] uppercase tracking-wide text-muted-foreground">
                  {n.date}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <nav
        className="flex shrink-0 flex-wrap items-center gap-6 border-t border-border/20 bg-background px-4 py-2 md:px-8"
        style={{ minHeight: "var(--home-subnav-height)" }}
      >
        <BackButton onClick={onBack} />
        <button
          type="button"
          onClick={onBackToIndex}
          className="text-[10px] uppercase tracking-wide text-muted-foreground hover:text-foreground md:text-xs"
        >
          News index
        </button>
      </nav>
    </div>
  );
}

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

  return (
    <div
      className="relative flex h-full min-h-0 flex-col"
      style={{ viewTransitionName: HOME_VT.expertise(slug) }}
    >
      {/* Full-bleed background + left overlay column */}
      <div className="relative min-h-0 flex-1 overflow-y-auto">
        <div className="relative min-h-full w-full">
          <Image
            src={IMAGE_EXPERTISE_HERO}
            alt=""
            fill
            className="object-cover object-[center_30%] brightness-[0.45]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/92 via-background/65 to-transparent" />
          <div className="relative z-10 mx-auto flex min-h-full max-w-6xl flex-col justify-center px-6 py-10">
            <div className="mb-6 flex flex-col items-start gap-4">
              <Image
                src={area.icon}
                alt=""
                width={64}
                height={64}
                className="h-14 w-14 shrink-0 md:h-16 md:w-16"
              />
              <h2 className="font-montserrat text-2xl font-semibold leading-tight text-foreground md:text-3xl">
                {area.label}
              </h2>
            </div>
            <div className="space-y-6 text-sm leading-relaxed text-foreground/95 md:text-base">
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
      </div>
      <nav
        className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border/20 bg-background px-3 py-2 md:gap-4 md:px-6"
        style={{ minHeight: "var(--home-subnav-height)" }}
        aria-label="Practice areas"
      >
        <BackButton onClick={onBack} />
        <div className="flex flex-1 flex-wrap items-center justify-end gap-2 md:gap-3">
          {EXPERTISE_AREAS.map((a) => (
            <button
              key={a.slug}
              type="button"
              onClick={() => onSelectSlug(a.slug)}
              className={`flex max-w-[120px] flex-col items-center gap-1 rounded px-2 py-1.5 text-center transition-colors sm:max-w-[140px] md:max-w-[160px] ${
                a.slug === slug
                  ? "text-foreground"
                  : "bg-transparent text-muted-foreground hover:bg-muted/20"
              }`}
              style={
                a.slug === slug
                  ? { backgroundColor: "var(--expertise-nav-active)" }
                  : undefined
              }
            >
              <Image
                src={a.icon}
                alt=""
                width={28}
                height={28}
                className="h-6 w-6 opacity-90 md:h-7 md:w-7"
              />
              <span className="text-[6px] font-medium leading-tight md:text-[8px]">
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function ExpandedProfessionals({ onBack }: { onBack: () => void }) {
  return (
    <div
      className="relative flex h-full min-h-0 flex-col"
      style={{ viewTransitionName: HOME_VT.professionals }}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <Image
          src={IMAGE_OUR_PROFESSIONALS}
          alt="CP LEX professionals"
          fill
          className="object-cover object-[center_28%] brightness-[0.6] saturate-[0.85]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-background/30" />
        <h2
          className={`absolute left-5 top-5 z-10 md:left-8 md:top-8 ${sectionTitle}`}
        >
          The Professionals
        </h2>
      </div>
      <nav
        className="flex shrink-0 items-center border-t border-border/20 bg-background px-4 py-2 md:px-8"
        style={{ minHeight: "var(--home-subnav-height)" }}
      >
        <BackButton onClick={onBack} />
      </nav>
    </div>
  );
}

function BackButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-sm px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 md:text-xs ${className}`}
      style={{ backgroundColor: "var(--back-button-bg)" }}
    >
      <Image
        src="/icons/back.svg"
        alt=""
        width={14}
        height={14}
        className="h-3.5 w-3.5 invert"
      />
      Back to home
    </button>
  );
}
