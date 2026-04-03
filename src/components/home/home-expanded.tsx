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
  IMAGE_THE_FIRM_2,
  USER_IMAGE,
} from "./content";
import { EXPERTISE_ANIMATED_ICON_BY_SLUG } from "@/components/icons/expertise-icon";
import { HOME_VT } from "./home-view-transition";
import { HomeNewsMarquee } from "./home-news-marquee";

const sectionTitle =
  "font-montserrat text-lg font-bold uppercase tracking-[0.35em] text-section-heading md:text-[26px]";

const FIRM_INTERNAL_STOPS = [0, 0.12, 0.24, 0.42, 0.67, 0.87, 1] as const;
const FIRM_EXTERNAL_PROGRESS = [
  1 / 6,
  2 / 6,
  3 / 6,
  4 / 6,
  4 / 6,
  5 / 6,
  1,
] as const;
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
const PROFESSIONALS_STOPS = [0, 1] as const;

const PROFESSIONALS_ITEMS = [
  { slug: "daniele-peppe", name: "Daniele Peppe", role: "Co-founder" },
  {
    slug: "michelangelo-capua",
    name: "Michelangelo Capua",
    role: "Co-founder",
  },
  { slug: "maria-elena", name: "Maria Elena", role: "" },
  { slug: "bucci", name: "Bucci", role: "" },
  { slug: "paolo-torsello", name: "Paolo Torsello", role: "" },
  { slug: "davide-pagani", name: "Davide Pagani", role: "" },
  { slug: "ludovica-bartolini", name: "Ludovica Bartolini", role: "" },
  { slug: "giuseppe", name: "Giuseppe", role: "" },
  { slug: "andrea-malagoli", name: "Andrea Malagoli", role: "" },
] as const;

const PROFESSIONALS_DETAILS: Record<
  (typeof PROFESSIONALS_ITEMS)[number]["slug"],
  {
    name: string;
    role: string;
    bioFormat: "prose" | "structured";
    proseBio?: string;
    qualifica?: string;
    istruzione?: string[];
    lingue?: string[];
    email?: string;
  }
> = {
  "daniele-peppe": {
    name: "Daniele Peppe",
    role: "Co-founder",
    bioFormat: "prose",
    proseBio:
      "Avv. Daniele Peppe specializes in criminal law and economic criminal law. He has developed extensive experience in both advisory and litigation assistance for individuals as well as companies.\n\nIn the field of judicial assistance — including several high-profile cases — he has developed particular expertise in criminal law relating to public administration and economic criminal law, including corporate offences, bankruptcy crimes, tax offences, urban planning and environmental crimes under Legislative Decree No. 152/2006 (Environmental Code), as well as offences concerning excise duties and petroleum products under Legislative Decree No. 504/1995 (Excise Duties Code).\n\nHe has participated in the defence in numerous proceedings involving allegations of corporate crimes, bankruptcy offences, and tax crimes, including cases involving liability under Legislative Decree No. 231/2001.",
  },
  "michelangelo-capua": {
    name: "Michelangelo Capua",
    role: "Co-founder",
    bioFormat: "prose",
    proseBio:
      "Avv. Michelangelo Capua is a co-founder of CP | LEX with extensive experience in corporate law, commercial transactions, and regulatory compliance.\n\nHis practice encompasses mergers and acquisitions, joint ventures, corporate governance, and commercial contracts. He regularly advises Italian and international clients on complex cross-border transactions.",
  },
  "maria-elena": {
    name: "Maria Elena",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    istruzione: [
      "Laurea cum laude presso l'Universita Luiss Guido Carli di Roma (2009)",
      "Albo degli Avvocati di Roma (2012)",
    ],
    lingue: ["Inglese", "Spagnolo"],
    email: "ginevraproia@previti.it",
  },
  bucci: {
    name: "Bucci",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "bucci@cplex.it",
  },
  "paolo-torsello": {
    name: "Paolo Torsello",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "torsello@cplex.it",
  },
  "davide-pagani": {
    name: "Davide Pagani",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "pagani@cplex.it",
  },
  "ludovica-bartolini": {
    name: "Ludovica Bartolini",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "bartolini@cplex.it",
  },
  giuseppe: {
    name: "Giuseppe",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "giuseppe@cplex.it",
  },
  "andrea-malagoli": {
    name: "Andrea Malagoli",
    role: "Associate",
    bioFormat: "structured",
    qualifica: "Avvocato",
    email: "malagoli@cplex.it",
  },
};

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
  const [activeTab, setActiveTab] =
    useState<(typeof FIRM_TABS)[number]["id"]>(tab);
  const [progressPercent, setProgressPercent] = useState(
    FIRM_EXTERNAL_PROGRESS[0] * 100
  );

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
      const target = Math.max(
        0,
        Math.min(FIRM_INTERNAL_STOPS.length - 1, nextStage)
      );
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
    const splitWrap = root.querySelector(
      '[data-anim="split-wrap"]'
    ) as HTMLElement | null;
    const imageWrap = root.querySelector(
      '[data-anim="firm-image"]'
    ) as HTMLElement | null;
    const contentPanel = root.querySelector(
      '[data-anim="content-panel"]'
    ) as HTMLElement | null;
    const imageDesc = root.querySelector(
      '[data-anim="image-desc"]'
    ) as HTMLElement | null;
    const principlesStage = root.querySelector(
      '[data-anim="stage-principles"]'
    ) as HTMLElement | null;
    const dualCardsStage = root.querySelector(
      '[data-anim="stage-dual-cards"]'
    ) as HTMLElement | null;
    const dualLeft = root.querySelector(
      '[data-anim="dual-left"]'
    ) as HTMLElement | null;
    const dualRight = root.querySelector(
      '[data-anim="dual-right"]'
    ) as HTMLElement | null;
    const complexStage = root.querySelector(
      '[data-anim="stage-complex"]'
    ) as HTMLElement | null;
    const complexHeading = root.querySelector(
      '[data-anim="complex-heading"]'
    ) as HTMLElement | null;
    const complexCards = root.querySelector(
      '[data-anim="complex-cards"]'
    ) as HTMLElement | null;
    const closingStage = root.querySelector(
      '[data-anim="stage-closing"]'
    ) as HTMLElement | null;
    const persistentTitle = root.querySelector(
      '[data-anim="firm-title"]'
    ) as HTMLElement | null;
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
    gsap.set(complexStage, { autoAlpha: 0, xPercent: 0, yPercent: 0 });
    gsap.set(complexHeading, {
      y: Math.min(window.innerHeight * 0.42, 320),
      autoAlpha: 0,
    });
    gsap.set(complexCards, { y: 48, autoAlpha: 0 });
    gsap.set(closingStage, { xPercent: -100, autoAlpha: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.to(imageWrap, { width: "58%", duration: 0.11, ease: "none" }, 0);
    tl.to(
      contentPanel,
      { xPercent: 0, autoAlpha: 1, duration: 0.11, ease: "none" },
      0
    );
    tl.to(
      imageDesc,
      { autoAlpha: 1, y: 0, duration: 0.06, ease: "none" },
      0.04
    );
    tl.to(
      imageDesc,
      { autoAlpha: 0, y: 20, duration: 0.07, ease: "power2.in" },
      0.13
    );
    tl.to(
      splitWrap,
      { yPercent: 130, duration: 0.11, ease: "power2.inOut" },
      0.13
    );
    tl.to(
      principlesStage,
      { yPercent: 0, duration: 0.11, ease: "power2.inOut" },
      0.13
    );
    tl.to(
      principlesStage,
      { xPercent: -100, autoAlpha: 0, duration: 0.08, ease: "power2.inOut" },
      0.26
    );
    tl.to(dualCardsStage, { autoAlpha: 1, duration: 0.02, ease: "none" }, 0.3);
    tl.to(
      dualLeft,
      { x: 0, autoAlpha: 1, duration: 0.11, ease: "power3.out" },
      0.3
    );
    tl.to(
      dualRight,
      { x: 0, autoAlpha: 1, duration: 0.11, ease: "power3.out" },
      0.3
    );
    tl.to(
      dualCardsStage,
      { yPercent: -130, autoAlpha: 0, duration: 0.08, ease: "power2.inOut" },
      0.44
    );
    tl.to(complexStage, { autoAlpha: 1, duration: 0.02, ease: "none" }, 0.54);
    tl.to(
      complexHeading,
      { y: 0, autoAlpha: 1, duration: 0.13, ease: "power2.out" },
      0.54
    );
    tl.to(
      complexHeading,
      { y: -100, autoAlpha: 0, duration: 0.06, ease: "power2.in" },
      0.69
    );
    tl.to(
      complexCards,
      { y: 0, autoAlpha: 1, duration: 0.11, ease: "power2.out" },
      0.76
    );
    tl.to(
      complexStage,
      { yPercent: -100, autoAlpha: 0, duration: 0.08, ease: "power2.inOut" },
      0.89
    );
    tl.to(
      persistentTitle,
      {
        y: -window.innerHeight * 1.2,
        autoAlpha: 0,
        duration: 0.08,
        ease: "power2.inOut",
      },
      0.89
    );
    tl.to(
      closingStage,
      { xPercent: 0, autoAlpha: 1, duration: 0.11, ease: "power2.out" },
      0.89
    );
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
        const dy = Math.max(
          -MAX_WHEEL_STEP,
          Math.min(MAX_WHEEL_STEP, e.deltaY)
        );
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
      const delta = Math.max(
        -MAX_WHEEL_STEP,
        Math.min(MAX_WHEEL_STEP, e.deltaY)
      );
      wheelAccumulator += delta;
      if (Math.abs(wheelAccumulator) < WHEEL_THRESHOLD) return;
      const direction = wheelAccumulator > 0 ? 1 : -1;
      wheelAccumulator = 0;
      const next = Math.max(
        0,
        Math.min(FIRM_INTERNAL_STOPS.length - 1, stageRef.current + direction)
      );
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
      <div
        ref={containerRef}
        className="relative min-h-0 flex-1 overflow-hidden"
      >
        <div
          data-anim="firm-title"
          className="absolute left-6 top-5 z-[45] md:left-10 md:top-8"
        >
          <h2 className={sectionTitle}>The Firm</h2>
        </div>
        <div data-anim="split-wrap" className="absolute inset-0 flex">
          <div
            data-anim="firm-image"
            className="relative h-full w-full shrink-0 overflow-hidden"
          >
            <Image
              src={IMAGE_THE_FIRM_BUILDING}
              alt=""
              fill
              className="object-cover object-center brightness-[0.55] saturate-[0.30]"
              sizes="100vw"
              priority
            />
            <div
              className="absolute inset-0 opacity-50"
              aria-hidden
              style={{
                background:
                  "linear-gradient(123.18deg, #000a21 3.93%, #0c1a39 34.71%)",
              }}
            />
          </div>
          <div
            data-anim="content-panel"
            className="absolute bottom-0 right-0 top-0 z-[5] w-[42%]"
            style={{ backgroundColor: "#581525" }}
          >
            <div className="flex h-full items-center px-6 md:px-10">
              <p className="text-sm leading-[190%] text-foreground md:text-[20px] md:leading-[1.55]">
                The Firm supports companies in designing and implementing
                compliance systems, including risk mapping, protocols,
                whistleblowing channels, and internal training programmes.
                Professionals also conduct internal investigations and integrate
                compliance frameworks with privacy/GDPR, anti-corruption,
                anti-money-laundering, workplace safety, environmental
                responsibility, and ESG standards.
              </p>
            </div>
          </div>
        </div>
        <div
          data-anim="image-desc"
          className="pointer-events-none absolute bottom-[140px] left-6 z-[15] max-w-[560px] md:left-10"
        >
          <p className="text-foreground text-[27px] leading-[1.45]">
            CP | LEX is a boutique law firm delivering sophisticated legal
            solutions.
          </p>
        </div>
        <div
          data-anim="stage-principles"
          className="absolute inset-0 z-20 flex flex-col"
        >
          <div className="relative h-[34%] shrink-0 overflow-hidden ">
            <Image
              src={IMAGE_THE_FIRM_2}
              alt=""
              fill
              className="object-cover object-top opacity-35"
            />
          </div>
          <div className="px-6 pt-[28px] md:px-10">
            <p className="text-[27px] text-[#f5f5f5]">
              Our practice is built on three core principles: clarity,
              integrity, and strategic thinking.
            </p>
          </div>
          <div className="max-w-[1000px] space-y-6 px-6 pt-[24px] md:px-10">
            <div className="flex items-start gap-4">
              <Image
                src="/icons/quote-1.svg"
                alt=""
                width={16}
                height={16}
                className="mt-1.5"
              />
              <p className="text-[15px] leading-[166%] md:text-[18px]">
                We believe that effective legal counsel goes beyond technical
                knowledge — it requires a deep understanding of our clients’
                objectives, industries, and risk landscape.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <Image
                src="/icons/quote-2.svg"
                alt=""
                width={16}
                height={16}
                className="mt-1.5"
              />
              <p className="text-[15px] leading-[166%] md:text-[18px]">
                Every matter is approached with careful analysis, structured
                thinking, and a commitment to delivering practical outcomes.
              </p>
            </div>
          </div>
        </div>
        <div
          data-anim="stage-dual-cards"
          className="absolute inset-0 z-30 px-6 pt-[104px] md:px-10"
        >
          <div className="grid h-[74%] grid-cols-2">
            <div
              data-anim="dual-left"
              className="flex flex-col justify-between bg-[#152241] p-[32px]"
            >
              <div className="space-y-4 text-[18px] leading-[166%]">
                <p>
                  CP | LEX combines deep knowledge of Italian law with a strong
                  international outlook.
                </p>
                <p>
                  We regularly assist multinational companies, investment
                  groups, and foreign clients operating or investing in Italy,
                  providing seamless legal support in both Italian and English.
                </p>
              </div>
              <Image src="/icons/quote-1.svg" alt="" width={76} height={76} />
            </div>
            <div
              data-anim="dual-right"
              className="flex flex-col justify-between bg-[#172547] p-[32px]"
            >
              <p className="text-[18px] leading-[166%]">
                Our work often involves cross-border transactions, international
                commercial relationships, and multi-jurisdictional legal
                matters.
              </p>
              <Image src="/icons/quote-2.svg" alt="" width={76} height={76} />
            </div>
          </div>
        </div>
        <div
          data-anim="stage-complex"
          className="absolute inset-0 z-40 flex items-center justify-center px-6 pt-[104px] md:px-10"
        >
          <div className="relative min-h-[min(52vh,400px)] w-full">
            <h2
              data-anim="complex-heading"
              className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center font-montserrat text-[52px] font-bold uppercase leading-[1.1] tracking-[0.18em] md:px-10"
            >
              Built for Complex Legal Challenges
            </h2>
            <div
              ref={cardsScrollRef}
              data-anim="complex-cards"
              className="absolute inset-0 z-[5] flex w-full flex-col overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="bg-[#152241] p-[24px]">
                <div className="mb-3 flex flex-col gap-3">
                  <Image
                    src="/icons/strategic-legal-insight.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                  <h3 className="text-[18px] font-semibold">
                    Strategic Legal Insight
                  </h3>
                </div>
                <p className="text-[18px]">
                  Today, CP LEX continues to advise Italian and international
                  clients across key commercial, industrial, financial, and
                  technology sectors. The firm approaches each matter with a
                  strategic perspective, combining legal precision with a deep
                  understanding of business dynamics. This approach allows CP
                  LEX to support clients in navigating complex transactions,
                  evolving regulatory environments, and high-stakes decisions.
                </p>
              </div>
              <div className="bg-[#1E2B4A] p-[24px]">
                <div className="mb-3 flex flex-col gap-3">
                  <Image
                    src="/icons/triangle.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                  <h3 className="text-[18px] font-semibold">
                    Integrated Expertise
                  </h3>
                </div>
                <p className="text-[18px]">
                  Complex legal challenges rarely exist in isolation. CP LEX
                  brings together expertise across corporate, commercial,
                  litigation, and regulatory matters to deliver coordinated
                  legal solutions. By working across practice areas, the firm is
                  able to address multifaceted issues with clarity and
                  efficiency, helping clients manage risk while pursuing growth
                  and innovation.
                </p>
              </div>
              <div className="bg-[#283657] p-[24px]">
                <div className="mb-3 flex flex-col gap-3">
                  <Image
                    src="/icons/focused-on-results.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                  <h3 className="text-[18px] font-semibold">
                    Focused on Results
                  </h3>
                </div>
                <p className="text-[15px]">
                  In a rapidly changing economic and technological landscape,
                  legal advice must be both rigorous and practical. CP LEX works
                  closely with its clients to develop solutions that are not
                  only legally sound but also aligned with their strategic
                  objectives. The firm’s commitment is to provide reliable
                  guidance in situations where complexity, speed, and precision
                  are essential.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          data-anim="stage-closing"
          className="absolute inset-0 z-50 flex items-center justify-center px-6 text-center md:px-10"
        >
          <div className="max-w-[960px]">
            <h2 className="mb-8 font-montserrat text-[56px] font-bold uppercase leading-[1.08] tracking-[0.12em] text-[#6A1E2D]">
              A Legacy of Precision. A Future of Trust.
            </h2>
            <p className="mx-auto mb-10 max-w-[700px] text-[18px] leading-[166%] text-[#d9d9d9]">
              Today, CP | LEX continues to advise Italian and international
              clients across key commercial, industrial, financial, and
              technology sectors.
            </p>
            <button
              onClick={onBack}
              className="cursor-pointer mx-auto flex w-full items-center justify-center gap-2 text-xs uppercase tracking-[2px]"
            >
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
      <div className="shrink-0 px-6 pt-5 pb-2 md:px-10">
        <h2 className={sectionTitle}>Our News</h2>
      </div>
      <HomeNewsMarquee onSelect={onSelectArticle} highlightId={highlightId} />
      <nav
        className="flex shrink-0 items-center px-6 py-2 md:px-10"
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
        <article className="bg-[#1B2C5080] px-6 pt-5 md:px-10  flex min-h-0 min-w-0 flex-[1.7] flex-col overflow-y-auto">
          <div className="max-w-[900px]">
            <h2 className={sectionTitle}>Our News</h2>
            <p className="mt-12 text-[10px] uppercase tracking-wider text-news-accent md:text-base">
              {item.date}
            </p>
            <h3 className="mt-3 text-xl md:text-[32px] font-medium leading-snug text-foreground">
              {item.title}
            </h3>
          </div>
          <div className="max-w-[900px] relative mt-4 aspect-[21/9] w-full shrink-0">
            <Image
              src={item.imageSrc}
              alt={item.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 70vw"
            />
          </div>
          <div className="max-w-[900px] pt-6 text-lg md:text-[18px] leading-relaxed text-foreground/95">
            {item.body.split("\n\n").map((p) => (
              <p key={p.slice(0, 24)} className="mb-4">
                {p}
              </p>
            ))}
          </div>
        </article>
        <aside className="popup-scroll flex max-h-[36vh] min-h-0 w-fit shrink-0 flex-col md:w-[30%] md:py-6 bg-[#0B1327]">
          <h4 className="px-6 pt-4 font-serif text-base text-foreground md:px-10">
            Other news
          </h4>
          <ul className="flex flex-col gap-4 px-6 pb-6 pt-3 md:px-10">
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
        className="flex shrink-0 flex-wrap items-center gap-2 px-6 py-2 md:px-10"
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
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Image
          src={IMAGE_EXPERTISE_HERO}
          alt=""
          fill
          className="object-cover object-[center_30%] brightness-[0.45]"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/92 via-background/65 to-transparent" />
      </div>
      <div className="relative z-10 flex min-h-0 max-w-[900px] flex-1 flex-col overflow-y-auto overscroll-contain [scrollbar-width:none]">
        <div className="flex w-full flex-col items-start px-6 pb-44 pt-10 md:px-10 md:pb-40">
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
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 bg-transparent "
        aria-label="Practice areas"
      >
        <div
          className="pointer-events-auto flex w-full justify-end px-6 pb-3 pt-0 md:px-10"
          onMouseLeave={() => setHoveredNavSlug(null)}
        >
          <div
            className="relative flex w-full max-w-[557px] overflow-hidden rounded-[8.4px] bg-[#0c1a39]"
            style={{ height: "110px" }}
          >
            {EXPERTISE_AREAS.map((a) => {
              const NavIcon = EXPERTISE_ANIMATED_ICON_BY_SLUG[a.slug];
              const isActive = a.slug === slug;
              const navActive = isActive || hoveredNavSlug === a.slug;
              return (
                <button
                  key={a.slug}
                  type="button"
                  onMouseEnter={() => setHoveredNavSlug(a.slug)}
                  onClick={() => onSelectSlug(a.slug)}
                  className={`group/tab relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 px-4 transition-all duration-300 ${
                    isActive ? "bg-[#001F55]" : "bg-transparent"
                  }`}
                >
                  <div
                    className={`transition-transform duration-200 group-hover/tab:scale-110 ${
                      isActive ? "h-12 w-12" : "h-8 w-8"
                    }`}
                  >
                    <NavIcon isHovered={navActive} />
                  </div>
                  <span
                    className="text-nowrap px-1 text-center text-white transition-all duration-300"
                    style={{ fontSize: isActive ? "12px" : "6px" }}
                  >
                    {a.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="pointer-events-auto flex w-full items-center bg-background px-6 py-2 md:px-10">
          <button
            type="button"
            onClick={onBack}
            className="group/back inline-flex cursor-pointer items-center gap-2"
          >
            <Image src="/icons/back-2.svg" alt="" width={14} height={14} />
            <span className="font-body text-xs font-semibold uppercase text-white transition-colors">
              Back to home
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export function ExpandedProfessionals({ onBack }: { onBack: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsScrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrubTargetRef = useRef(0);
  const scrubTweenRef = useRef<gsap.core.Tween | null>(null);
  const wheelAccumRef = useRef(0);
  const wheelIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageRef = useRef(0);
  const [professionalsStageIndex, setProfessionalsStageIndex] = useState(0);
  const [selectedSlug, setSelectedSlug] = useState<
    (typeof PROFESSIONALS_ITEMS)[number]["slug"] | null
  >(null);
  const selectedDetail = selectedSlug
    ? PROFESSIONALS_DETAILS[selectedSlug]
    : null;

  const syncUiFromProgress = useCallback((progress: number) => {
    stageRef.current = progress >= 0.5 ? 1 : 0;
  }, []);

  const animateToStage = useCallback(
    (nextStage: number) => {
      const tl = timelineRef.current;
      if (!tl) return;
      const target = Math.max(
        0,
        Math.min(PROFESSIONALS_STOPS.length - 1, nextStage)
      );
      const targetProgress = PROFESSIONALS_STOPS[target];
      scrubTweenRef.current?.kill();
      scrubTweenRef.current = gsap.to(tl, {
        progress: targetProgress,
        duration: 1,
        ease: "power2.inOut",
        overwrite: true,
        onUpdate: () => syncUiFromProgress(tl.progress()),
        onComplete: () => {
          scrubTargetRef.current = targetProgress;
          setProfessionalsStageIndex(target);
        },
      });
    },
    [syncUiFromProgress]
  );

  const handleSelectCard = useCallback(
    (slug: (typeof PROFESSIONALS_ITEMS)[number]["slug"]) => {
      if (selectedSlug) return;
      setSelectedSlug(slug);
      requestAnimationFrame(() => {
        const panel = panelRef.current;
        if (!panel) return;
        gsap.fromTo(
          panel,
          { x: "100%", autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out" }
        );
      });
    },
    [selectedSlug]
  );

  const handleClosePanel = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) {
      setSelectedSlug(null);
      return;
    }
    gsap.to(panel, {
      x: "100%",
      autoAlpha: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => setSelectedSlug(null),
    });
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const heroPhoto = root.querySelector(
      '[data-anim="pros-hero-photo"]'
    ) as HTMLElement | null;
    const cardsStage = root.querySelector(
      '[data-anim="pros-cards-stage"]'
    ) as HTMLElement | null;
    if (!heroPhoto || !cardsStage) return;
    gsap.set(cardsStage, { autoAlpha: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.to(
      heroPhoto,
      {
        xPercent: -120,
        duration: 0.55,
        ease: "power2.inOut",
      },
      0
    );
    tl.to(
      cardsStage,
      {
        autoAlpha: 1,
        duration: 0.38,
        ease: "power2.inOut",
      },
      0.18
    );
    timelineRef.current = tl;
    scrubTargetRef.current = 0;
    setProfessionalsStageIndex(0);
    syncUiFromProgress(0);
    return () => {
      scrubTweenRef.current?.kill();
      if (wheelIdleTimerRef.current) clearTimeout(wheelIdleTimerRef.current);
      tl.kill();
      timelineRef.current = null;
    };
  }, [syncUiFromProgress]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const MAX_WHEEL_STEP = 60;
    /** Accumulated delta before snapping to the next / previous stage (no continuous scrub). */
    const ACCUM_THRESHOLD = 72;

    const onWheel = (e: WheelEvent) => {
      const tl = timelineRef.current;
      if (!tl) return;

      if (selectedSlug) return;
      const cardsEl = cardsScrollRef.current;
      if (
        cardsEl &&
        stageRef.current === 1 &&
        cardsEl.contains(e.target as Node)
      ) {
        const scrollH = cardsEl.scrollHeight;
        const clientH = cardsEl.clientHeight;
        const st = cardsEl.scrollTop;
        const dy = Math.max(
          -MAX_WHEEL_STEP,
          Math.min(MAX_WHEEL_STEP, e.deltaY)
        );
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
      const delta = Math.max(
        -MAX_WHEEL_STEP,
        Math.min(MAX_WHEEL_STEP, e.deltaY)
      );
      const current = stageRef.current;
      if ((delta > 0 && current === 1) || (delta < 0 && current === 0)) {
        return;
      }

      wheelAccumRef.current += delta;
      if (wheelIdleTimerRef.current) clearTimeout(wheelIdleTimerRef.current);
      wheelIdleTimerRef.current = setTimeout(() => {
        wheelAccumRef.current = 0;
      }, 140);

      if (Math.abs(wheelAccumRef.current) < ACCUM_THRESHOLD) return;

      const dir = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;

      if (dir > 0 && current === 0) animateToStage(1);
      else if (dir < 0 && current === 1) animateToStage(0);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      if (wheelIdleTimerRef.current) clearTimeout(wheelIdleTimerRef.current);
      el.removeEventListener("wheel", onWheel);
    };
  }, [animateToStage, selectedSlug]);

  return (
    <div
      className="relative flex h-full min-h-0 flex-col"
      style={{ viewTransitionName: HOME_VT.professionals, borderRadius: 0 }}
    >
      <div
        ref={containerRef}
        className="relative min-h-0 flex-1 overflow-hidden"
      >
        <div data-anim="pros-hero-photo" className="absolute inset-0">
          <Image
            src={IMAGE_OUR_PROFESSIONALS}
            alt="CP LEX professionals"
            fill
            className="object-cover object-[center_28%] brightness-[0.65] saturate-[0.30]"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 opacity-50"
            aria-hidden
            style={{
              background:
                "linear-gradient(123.18deg, #000a21 3.93%, #0c1a39 34.71%)",
            }}
          />
        </div>
        <h2
          className={`absolute left-6 top-5 z-30 md:left-10 md:top-8 ${sectionTitle}`}
        >
          The Professionals
        </h2>
        <div
          data-anim="pros-cards-stage"
          className={`absolute inset-0 z-20 ${
            selectedSlug ? "pointer-events-none" : ""
          }`}
        >
          <div
            ref={cardsScrollRef}
            className="pt-40 h-[min(78vh,760px)] overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="grid grid-cols-3 w-full px-6 pb-12 md:px-10">
              {PROFESSIONALS_ITEMS.map((item, index) => (
                <article
                  key={item.slug}
                  onClick={() => handleSelectCard(item.slug)}
                  className={`cursor-pointer flex min-h-[180px] items-center gap-5 border-[#22355E] hover:bg-[#14244A66] p-6 transition-colors duration-300 ${
                    index % 3 !== 2 ? "border-r-[0.5px]" : ""
                  } ${
                    index < PROFESSIONALS_ITEMS.length - 3
                      ? "border-b-[0.5px]"
                      : ""
                  }`}
                >
                  <div className="relative h-[123px] w-[116px] shrink-0 overflow-hidden rounded-[5px]">
                    <Image
                      src={USER_IMAGE}
                      alt={item.name}
                      fill
                      className="object-cover object-top grayscale transition-all duration-300 hover:grayscale-0"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: "rgba(20, 36, 74, 0.4)" }}
                    />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-medium leading-[35px] text-white">
                      {item.name}
                    </h3>
                    {item.role ? (
                      <p className="text-[18px] leading-[35px] text-[#4d5873]">
                        {item.role}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {selectedSlug && selectedDetail && (
          <>
            <button
              type="button"
              aria-label="Close professional details"
              className="absolute inset-0 z-[35] cursor-default bg-transparent"
              onClick={handleClosePanel}
            />
            <div
              ref={panelRef}
              className="absolute inset-y-0 right-0 z-40 flex w-[70%] flex-col overflow-y-auto bg-[#23345E] px-6 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ visibility: "hidden" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClosePanel}
                className="cursor-pointer flex items-center gap-2 pb-3 pt-7"
              >
                <Image src="/icons/back.svg" alt="" width={21} height={21} />
                <span className="text-[10px] font-semibold uppercase tracking-[1.3px]">
                  Back to team
                </span>
              </button>
              <div className="flex min-h-0 flex-1 gap-6 overflow-hidden pb-8">
                <div className="relative h-[212px] w-[200px] shrink-0 overflow-hidden rounded-[8px]">
                  <Image
                    src={USER_IMAGE}
                    alt={selectedDetail.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <h3 className="text-[37px] font-semibold leading-none">
                    {selectedDetail.name}
                  </h3>
                  <p className="mb-4 mt-2 text-[20px] text-[#4D5873]">
                    {selectedDetail.role}
                  </p>
                  {selectedDetail.bioFormat === "prose" ? (
                    <div className="max-w-[771px]">
                      {(selectedDetail.proseBio ?? "")
                        .split("\n\n")
                        .map((paragraph) => (
                          <p
                            key={paragraph.slice(0, 30)}
                            className="mb-6 text-[21px] leading-[30px] text-[#D9D9D9]"
                          >
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-7">
                      {[
                        {
                          label: "Qualifica",
                          value: selectedDetail.qualifica ?? "",
                          icon: "/icons/qualifica.svg",
                        },
                        {
                          label: "Istruzione",
                          value: (selectedDetail.istruzione ?? []).join("\n"),
                          icon: "/icons/istruzione.svg",
                        },
                        {
                          label: "Lingue",
                          value: (selectedDetail.lingue ?? []).join(", "),
                          icon: "/icons/language.svg",
                        },
                        {
                          label: "Email",
                          value: selectedDetail.email ?? "",
                          isEmail: true,
                          icon: "/icons/mail.svg",
                        },
                      ].map((row) =>
                        row.value ? (
                          <div
                            key={row.label}
                            className="flex items-start gap-5"
                          >
                            <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[6px] bg-[#6969693D]">
                              <Image
                                src={row.icon}
                                alt={row.label}
                                width={24}
                                height={24}
                              />
                            </div>
                            <div>
                              <p className="text-[16px] font-medium text-[#f8fafc]">
                                {row.label}
                              </p>
                              {row.value.split("\n").map((line) => (
                                <p
                                  key={line}
                                  className={`text-[15px] font-medium leading-[24.75px] ${
                                    row.isEmail
                                      ? "text-[#f8fafc]"
                                      : "text-[#94a3b8]"
                                  }`}
                                >
                                  {line}
                                </p>
                              ))}
                            </div>
                          </div>
                        ) : null
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <nav
        className="flex w-full shrink-0 items-center gap-3 bg-background px-6 py-2 md:px-10"
        style={{ minHeight: "var(--home-subnav-height)" }}
      >
        <BackButton onClick={onBack} />
        {/* {professionalsStageIndex === 0 && !selectedSlug ? ( */}
        <button
          type="button"
          onClick={() => animateToStage(1)}
          className="cursor-pointer inline-flex items-center gap-2 rounded-sm px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-foreground transition-opacity hover:opacity-90 md:text-xs"
        >
          View team
        </button>
        {/* ) : null} */}
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
