"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
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
import { HomeNewsMarquee } from "./home-news-marquee";

const sectionTitle =
  "font-montserrat text-lg font-bold uppercase tracking-[0.35em] text-section-heading md:text-[24px]";

const FIRM_INTERNAL_STOPS = [0, 0.12, 0.24, 0.42, 0.67, 0.87, 1] as const;
const FIRM_EXTERNAL_PROGRESS = [1 / 6, 2 / 6, 3 / 6, 4 / 6, 4 / 6, 5 / 6, 1] as const;
const STAGE_TO_TAB: (typeof FIRM_TABS)[number]["id"][] = [
  "overview",
  "overview",
  "approach",
  "international",
  "international",
  "challenges",
  "challenges",
];
const TAB_TO_STAGE: Record<(typeof FIRM_TABS)[number]["id"], number> = {
  overview: 1,
  approach: 2,
  international: 4,
  challenges: 6,
};
const CARDS_STAGE_INDEX = 5;

function FirmSubnavWithProgress({
  activeTab,
  progressPercent,
  onTabClick,
  onBack,
}: {
  activeTab: (typeof FIRM_TABS)[number]["id"];
  progressPercent: number;
  onTabClick: (id: (typeof FIRM_TABS)[number]["id"]) => void;
  onBack: () => void;
}) {
  const segmentSpan = 100 / 6;
  /**
   * Column s (0..5) is fully covered when progress reaches the end of that column.
   * Columns:
   * 0 Back, 1..4 firm tabs, 5 trailing empty column.
   */
  const segmentFilled = (s: number) =>
    progressPercent >= (s + 1) * segmentSpan - 0.01;

  return (
    <div className="relative min-h-0 w-full flex-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-[#0C152A] to-[#0646D0] transition-[width] duration-200 ease-out"
        style={{ width: `${progressPercent}%` }}
      />
      <div className="relative z-10 grid h-full w-full min-w-0 grid-cols-6">
        <button
          type="button"
          onClick={onBack}
          className={`cursor-pointer flex min-h-0 min-w-0 items-center justify-center gap-2 bg-transparent px-2 py-2 text-center text-[9px] font-semibold uppercase leading-tight tracking-wide transition-opacity hover:opacity-90 md:px-3 md:text-[11px] ${
            segmentFilled(0)
              ? "text-white"
              : "text-muted-foreground hover:text-foreground/90"
          }`}
        >
          <Image
            src="/icons/back-2.svg"
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 shrink-0"
          />
          <span className="min-w-0 leading-tight">Back to home</span>
        </button>
        {FIRM_TABS.map((t, i) => {
          const isActive = activeTab === t.id;
          const s = 1 + i; // 1..4
          const onFilledPortion = segmentFilled(s);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabClick(t.id)}
              aria-current={isActive ? "page" : undefined}
              className={`cursor-pointer flex min-h-0 min-w-0 items-center justify-center px-1.5 py-2 text-center text-[9px] uppercase leading-tight tracking-wide transition-colors md:px-3 md:text-[11px] ${
                onFilledPortion
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground/90"
              } ${isActive ? "font-semibold" : "font-normal"}`}
            >
              {t.label}
            </button>
          );
        })}
        {/* trailing column to let stage 6 reach exact full width */}
        <div aria-hidden className="min-h-0 min-w-0" />
      </div>
    </div>
  );
}

export function ExpandedFirm({
  onBack,
  tab,
  onTabChange,
}: {
  onBack: () => void;
  tab: (typeof FIRM_TABS)[number]["id"];
  onTabChange: (id: (typeof FIRM_TABS)[number]["id"]) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsScrollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const stageRef = useRef(0);
  const animatingRef = useRef(false);
  const [activeTab, setActiveTab] = useState<(typeof FIRM_TABS)[number]["id"]>(tab);
  const [progressPercent, setProgressPercent] = useState(FIRM_EXTERNAL_PROGRESS[0] * 100);

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  const syncProgressFromTimeline = useCallback((rawProgress: number) => {
    const totalSegments = FIRM_INTERNAL_STOPS.length - 1;
    const scaled = rawProgress * totalSegments;
    const lower = Math.max(0, Math.floor(scaled));
    const upper = Math.min(totalSegments, lower + 1);
    const t = scaled - lower;
    const start = FIRM_EXTERNAL_PROGRESS[lower];
    const end = FIRM_EXTERNAL_PROGRESS[upper];
    setProgressPercent((start + (end - start) * t) * 100);
  }, []);

  const animateToStage = useCallback(
    (nextStage: number) => {
      const tl = timelineRef.current;
      if (!tl || animatingRef.current) return;
      const target = Math.max(0, Math.min(FIRM_INTERNAL_STOPS.length - 1, nextStage));
      const targetProgress = FIRM_INTERNAL_STOPS[target];
      animatingRef.current = true;
      stageRef.current = target;
      const mappedTab = STAGE_TO_TAB[target] ?? "overview";
      setActiveTab(mappedTab);
      onTabChange(mappedTab);
      gsap.to(tl, {
        progress: targetProgress,
        duration: 0.72,
        ease: "power2.inOut",
        overwrite: true,
        onUpdate: () => syncProgressFromTimeline(tl.progress()),
        onComplete: () => {
          animatingRef.current = false;
          if (target === CARDS_STAGE_INDEX && cardsScrollRef.current) {
            cardsScrollRef.current.scrollTop = 0;
          }
        },
      });
    },
    [onTabChange, syncProgressFromTimeline]
  );

  const handleTabClick = useCallback(
    (id: (typeof FIRM_TABS)[number]["id"]) => {
      animateToStage(TAB_TO_STAGE[id]);
    },
    [animateToStage]
  );

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const splitWrap = root.querySelector('[data-anim="split-wrap"]') as HTMLElement | null;
    const imageWrap = root.querySelector('[data-anim="firm-image"]') as HTMLElement | null;
    const contentPanel = root.querySelector('[data-anim="content-panel"]') as HTMLElement | null;
    const imageDesc = root.querySelector('[data-anim="image-desc"]') as HTMLElement | null;
    const principlesStage = root.querySelector('[data-anim="stage-principles"]') as HTMLElement | null;
    const dualCardsStage = root.querySelector('[data-anim="stage-dual-cards"]') as HTMLElement | null;
    const dualLeft = root.querySelector('[data-anim="dual-left"]') as HTMLElement | null;
    const dualRight = root.querySelector('[data-anim="dual-right"]') as HTMLElement | null;
    const complexStage = root.querySelector('[data-anim="stage-complex"]') as HTMLElement | null;
    const complexHeading = root.querySelector('[data-anim="complex-heading"]') as HTMLElement | null;
    const complexCards = root.querySelector('[data-anim="complex-cards"]') as HTMLElement | null;
    const closingStage = root.querySelector('[data-anim="stage-closing"]') as HTMLElement | null;
    const persistentTitle = root.querySelector('[data-anim="firm-title"]') as HTMLElement | null;
    if (
      !splitWrap ||
      !imageWrap ||
      !contentPanel ||
      !imageDesc ||
      !principlesStage ||
      !dualCardsStage ||
      !dualLeft ||
      !dualRight ||
      !complexStage ||
      !complexHeading ||
      !complexCards ||
      !closingStage ||
      !persistentTitle
    ) {
      return;
    }
    gsap.set(contentPanel, { xPercent: 100, autoAlpha: 0 });
    gsap.set(imageDesc, { autoAlpha: 1, y: 0 });
    gsap.set(splitWrap, { yPercent: 0 });
    gsap.set(principlesStage, { yPercent: -100, xPercent: 0, autoAlpha: 1 });
    gsap.set(dualCardsStage, { autoAlpha: 0 });
    gsap.set(dualLeft, { x: -window.innerWidth, autoAlpha: 0 });
    gsap.set(dualRight, { x: window.innerWidth, autoAlpha: 0 });
    gsap.set(complexStage, { autoAlpha: 0, xPercent: 0 });
    gsap.set(complexHeading, { y: Math.min(window.innerHeight * 0.42, 320), autoAlpha: 0 });
    gsap.set(complexCards, { y: 48, autoAlpha: 0 });
    gsap.set(closingStage, { xPercent: -100, autoAlpha: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.to(imageWrap, { width: "58%", duration: 0.11, ease: "none" }, 0);
    tl.to(contentPanel, { xPercent: 0, autoAlpha: 1, duration: 0.11, ease: "none" }, 0);
    tl.to(imageDesc, { autoAlpha: 1, y: 0, duration: 0.06, ease: "none" }, 0.04);
    tl.to(imageDesc, { autoAlpha: 0, y: 20, duration: 0.07, ease: "power2.in" }, 0.13);
    tl.to(splitWrap, { yPercent: 130, duration: 0.11, ease: "power2.inOut" }, 0.13);
    tl.to(principlesStage, { yPercent: 0, duration: 0.11, ease: "power2.inOut" }, 0.13);
    tl.to(principlesStage, { xPercent: -100, autoAlpha: 0, duration: 0.08, ease: "power2.inOut" }, 0.26);
    tl.to(dualCardsStage, { autoAlpha: 1, duration: 0.02, ease: "none" }, 0.3);
    tl.to(dualLeft, { x: 0, autoAlpha: 1, duration: 0.11, ease: "power3.out" }, 0.3);
    tl.to(dualRight, { x: 0, autoAlpha: 1, duration: 0.11, ease: "power3.out" }, 0.3);
    tl.to(dualCardsStage, { yPercent: -130, autoAlpha: 0, duration: 0.08, ease: "power2.inOut" }, 0.44);
    tl.to(complexStage, { autoAlpha: 1, duration: 0.02, ease: "none" }, 0.54);
    tl.to(complexHeading, { y: 0, autoAlpha: 1, duration: 0.13, ease: "power2.out" }, 0.54);
    tl.to(complexHeading, { y: -100, autoAlpha: 0, duration: 0.06, ease: "power2.in" }, 0.69);
    tl.to(complexCards, { y: 0, autoAlpha: 1, duration: 0.11, ease: "power2.out" }, 0.76);
    tl.to(complexStage, { xPercent: 140, autoAlpha: 0, duration: 0.08, ease: "power2.inOut" }, 0.89);
    tl.to(persistentTitle, { x: window.innerWidth * 1.4, autoAlpha: 0, duration: 0.08, ease: "power2.inOut" }, 0.89);
    tl.to(closingStage, { xPercent: 0, autoAlpha: 1, duration: 0.11, ease: "power2.out" }, 0.89);
    timelineRef.current = tl;
    syncProgressFromTimeline(0);
    return () => {
      tl.kill();
      timelineRef.current = null;
    };
  }, [syncProgressFromTimeline]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let wheelAccumulator = 0;
    const WHEEL_THRESHOLD = 90;
    const MAX_WHEEL_STEP = 60;
    const onWheel = (e: WheelEvent) => {
      if (animatingRef.current) return;
      const cardsEl = cardsScrollRef.current;
      if (
        cardsEl &&
        stageRef.current === CARDS_STAGE_INDEX &&
        cardsEl.contains(e.target as Node)
      ) {
        const scrollH = cardsEl.scrollHeight;
        const clientH = cardsEl.clientHeight;
        const st = cardsEl.scrollTop;
        const dy = Math.max(-MAX_WHEEL_STEP, Math.min(MAX_WHEEL_STEP, e.deltaY));
        const atBottom = st + clientH >= scrollH - 2;
        const atTop = st <= 2;
        if (scrollH > clientH) {
          if (dy > 0 && !atBottom) {
            e.preventDefault();
            cardsEl.scrollTop = Math.min(scrollH - clientH, st + dy);
            return;
          }
          if (dy < 0 && !atTop) {
            e.preventDefault();
            cardsEl.scrollTop = Math.max(0, st + dy);
            return;
          }
        }
      }
      e.preventDefault();
      const delta = Math.max(-MAX_WHEEL_STEP, Math.min(MAX_WHEEL_STEP, e.deltaY));
      wheelAccumulator += delta;
      if (Math.abs(wheelAccumulator) < WHEEL_THRESHOLD) return;
      const direction = wheelAccumulator > 0 ? 1 : -1;
      wheelAccumulator = 0;
      const next = Math.max(0, Math.min(FIRM_INTERNAL_STOPS.length - 1, stageRef.current + direction));
      if (next !== stageRef.current) {
        animateToStage(next);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [animateToStage]);

  return (
    <div
      className="relative flex h-full min-h-0 flex-col"
      style={{ viewTransitionName: HOME_VT.firm, borderRadius: 0 }}
    >
      <div ref={containerRef} className="relative min-h-0 flex-1 overflow-hidden">
        <div data-anim="firm-title" className="absolute left-5 top-5 z-[45] md:left-8 md:top-8">
          <h2 className={sectionTitle}>The Firm</h2>
        </div>
        <div data-anim="split-wrap" className="absolute inset-0 flex">
          <div data-anim="firm-image" className="relative h-full w-full shrink-0 overflow-hidden">
            <Image src={IMAGE_THE_FIRM_BUILDING} alt="" fill className="object-cover object-center brightness-[0.55] saturate-[0.85]" sizes="100vw" priority />
          </div>
          <div data-anim="content-panel" className="absolute bottom-0 right-0 top-0 z-[5] w-[42%] max-md:w-[55%]" style={{ backgroundColor: "#581525" }}>
            <div className="flex h-full items-center px-8 md:px-12">
              <p className="text-sm leading-[190%] text-foreground md:text-[27px] md:leading-[1.55]">
                The Firm supports companies in designing and implementing compliance systems, including risk mapping, protocols, whistleblowing channels, and internal training programmes. Professionals also conduct internal investigations and integrate compliance frameworks with privacy/GDPR, anti-corruption, anti-money-laundering, workplace safety, environmental responsibility, and ESG standards.
              </p>
            </div>
          </div>
        </div>
        <div data-anim="image-desc" className="pointer-events-none absolute bottom-[140px] left-[34px] z-[15] max-w-[560px] md:left-[50px]">
          <p className="text-foreground text-3xl leading-[1.45] max-md:text-[22px]">
            CP | LEX is a boutique law firm delivering sophisticated legal solutions.
          </p>
        </div>
        <div data-anim="stage-principles" className="absolute inset-0 z-20 flex flex-col">
          <div className="relative h-[34%] shrink-0 overflow-hidden max-md:h-[26%]">
            <Image src={IMAGE_THE_FIRM_BUILDING} alt="" fill className="object-cover object-top opacity-35" />
          </div>
          <div className="px-[34px] pt-[28px] md:px-6">
            <p className="text-[27px] text-[#f5f5f5] max-md:text-xl">
              Our practice is built on three core principles: clarity, integrity, and strategic thinking.
            </p>
          </div>
          <div className="max-w-[1000px] space-y-6 px-[34px] pt-[24px] md:px-6">
            <div className="flex items-start gap-4">
              <Image src="/icons/quote-1.svg" alt="" width={16} height={16} className="mt-1.5" />
              <p className="text-[15px] leading-[166%] md:text-[28px]">
                We believe that effective legal counsel goes beyond technical knowledge — it requires a deep understanding of our clients’ objectives, industries, and risk landscape.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <Image src="/icons/quote-2.svg" alt="" width={16} height={16} className="mt-1.5" />
              <p className="text-[15px] leading-[166%] md:text-[28px]">
                Every matter is approached with careful analysis, structured thinking, and a commitment to delivering practical outcomes.
              </p>
            </div>
          </div>
        </div>
        <div data-anim="stage-dual-cards" className="absolute inset-0 z-30 px-[34px] pt-[104px] md:px-6">
          <div className="grid h-[74%] grid-cols-2">
            <div data-anim="dual-left" className="flex flex-col justify-between bg-[#152241] p-[32px]">
              <div className="space-y-4 text-[18px] leading-[166%]">
                <p>CP | LEX combines deep knowledge of Italian law with a strong international outlook.</p>
                <p>We regularly assist multinational companies, investment groups, and foreign clients operating or investing in Italy, providing seamless legal support in both Italian and English.</p>
              </div>
              <Image src="/icons/quote-1.svg" alt="" width={76} height={76} />
            </div>
            <div data-anim="dual-right" className="flex flex-col justify-between bg-[#152241] p-[32px]">
              <p className="text-[18px] leading-[166%]">
                Our work often involves cross-border transactions, international commercial relationships, and multi-jurisdictional legal matters.
              </p>
              <Image src="/icons/quote-2.svg" alt="" width={76} height={76} />
            </div>
          </div>
        </div>
        <div data-anim="stage-complex" className="absolute inset-0 z-40 flex items-center justify-center px-[34px] pt-[104px] md:px-6">
          <div className="relative min-h-[min(52vh,440px)] w-full">
            <h2 data-anim="complex-heading" className="absolute inset-0 z-10 flex items-center justify-center px-2 text-center font-montserrat text-[52px] font-semibold uppercase leading-[1.1] tracking-[0.18em]">
              Built for Complex Legal Challenges
            </h2>
            <div ref={cardsScrollRef} data-anim="complex-cards" className="absolute inset-0 z-[5] flex w-full flex-col overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="bg-[#152241] p-[24px]">
                <div className="mb-3 flex flex-col gap-3">
                  <Image src="/icons/strategic-legal-insight.svg" alt="" width={16} height={16} />
                  <h3 className="text-[18px] font-semibold">Strategic Legal Insight</h3>
                </div>
                <p className="text-[18px]">Today, CP LEX continues to advise Italian and international clients across key commercial, industrial, financial, and technology sectors. The firm approaches each matter with a strategic perspective, combining legal precision with a deep understanding of business dynamics. This approach allows CP LEX to support clients in navigating complex transactions, evolving regulatory environments, and high-stakes decisions.</p>
              </div>
              <div className="bg-[#1E2B4A] p-[24px]">
                <div className="mb-3 flex flex-col gap-3">
                  <Image src="/icons/triangle.svg" alt="" width={16} height={16} />
                  <h3 className="text-[18px] font-semibold">Integrated Expertise</h3>
                </div>
                <p className="text-[15px]">Complex legal challenges rarely exist in isolation. CP LEX brings together expertise across corporate, commercial, litigation, and regulatory matters to deliver coordinated legal solutions. By working across practice areas, the firm is able to address multifaceted issues with clarity and efficiency, helping clients manage risk while pursuing growth and innovation.</p>
              </div>
              <div className="bg-[#283657] p-[24px]">
                <div className="mb-3 flex flex-col gap-3">
                  <Image src="/icons/focused-on-results.svg" alt="" width={16} height={16} />
                  <h3 className="text-[18px] font-semibold">Focused on Results</h3>
                </div>
                <p className="text-[15px]">In a rapidly changing economic and technological landscape, legal advice must be both rigorous and practical. CP LEX works closely with its clients to develop solutions that are not only legally sound but also aligned with their strategic objectives. The firm’s commitment is to provide reliable guidance in situations where complexity, speed, and precision are essential.</p>
              </div>
            </div>
          </div>
        </div>
        <div data-anim="stage-closing" className="absolute inset-0 z-50 flex items-center justify-center px-[34px] text-center md:px-6">
          <div className="max-w-[960px]">
            <h2 className="mb-8 font-montserrat text-[56px] font-bold uppercase leading-[1.08] tracking-[0.12em] text-[#6A1E2D]">
              A Legacy of Precision. A Future of Trust.
            </h2>
            <p className="mx-auto mb-10 max-w-[700px] text-[18px] leading-[166%] text-[#d9d9d9]">
              Today, CP | LEX continues to advise Italian and international clients across key commercial, industrial, financial, and technology sectors.
            </p>
            <button onClick={onBack} className="cursor-pointer mx-auto flex w-full items-center justify-center gap-2 text-xs uppercase tracking-[2px]">
              Back to exploring other sections →
            </button>
          </div>
        </div>
      </div>
      <nav
        className="flex w-full shrink-0 overflow-hidden bg-[#121111]"
        style={{ minHeight: "var(--home-subnav-height)" }}
        aria-label="Firm sections"
      >
        <FirmSubnavWithProgress
          activeTab={activeTab}
          progressPercent={progressPercent}
          onTabClick={handleTabClick}
          onBack={onBack}
        />
      </nav>
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
      style={{ viewTransitionName: HOME_VT.news, borderRadius: 0 }}
    >
      <div className="shrink-0 px-5 pt-5 md:px-10">
        <h2 className={sectionTitle}>Our News</h2>
      </div>
      <HomeNewsMarquee
        onSelect={onSelectArticle}
        highlightId={highlightId}
      />
      <nav
        className="flex shrink-0 items-center px-4 py-2 md:px-8"
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
      style={{ viewTransitionName: HOME_VT.news, borderRadius: 0 }}
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
                  className="cursor-pointer w-full text-left text-xs text-foreground hover:underline md:text-sm"
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
        className="flex shrink-0 flex-wrap items-center gap-2 px-4 py-2 md:px-8"
        style={{ minHeight: "var(--home-subnav-height)" }}
      >
        <BackButton onClick={onBack} />
        <button
          type="button"
          onClick={onBackToIndex}
          className="cursor-pointer inline-flex items-center gap-2 rounded-sm px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-foreground transition-opacity hover:opacity-90 md:text-xs "
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
      style={{
        viewTransitionName: HOME_VT.expertise(slug),
        borderRadius: 0,
      }}
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
        className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-3 py-2 md:gap-4 md:px-6"
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
      style={{ viewTransitionName: HOME_VT.professionals, borderRadius: 0 }}
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
        className="flex shrink-0 items-center px-4 py-2 md:px-8 bg-transparent"
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
      className={`cursor-pointer inline-flex items-center gap-2 rounded-sm px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-foreground transition-opacity hover:opacity-90 md:text-xs ${className}`}
    >
      <Image
        src="/icons/back-2.svg"
        alt="back button"
        width={16}
        height={16}
        className="h-4 w-4"
      />
      Back to home
    </button>
  );
}
