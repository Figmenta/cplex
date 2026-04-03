import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { FIRM_TABS } from "./content";
import {
  FIRM_EXTERNAL_PROGRESS,
  FIRM_INTERNAL_STOPS,
} from "@/constant/variabls";
import {
  STAGE_TO_TAB,
  TAB_TO_STAGE,
  CARDS_STAGE_INDEX,
} from "@/constant/variabls";
import { SUBNAV_MIN_STYLE } from "@/constant/variabls";
import { FirmSubnavWithProgress } from "./firm-progress";
import Image from "next/image";
import { IMAGE_THE_FIRM_BUILDING } from "./content";
import { sectionTitle } from "@/constant/variabls";
import { IMAGE_THE_FIRM_2 } from "./content";
import { HOME_VT } from "./home-view-transition";

/** Longer timeline segments = less rushed motion between firm stages (progress 0–1 unchanged). */
const FIRM_TL_SCALE = 1.55;
/** Time to scrub the timeline when changing tab / wheel step. */
const FIRM_STAGE_SCRUB_DURATION = 1.35;

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
        duration: FIRM_STAGE_SCRUB_DURATION,
        ease: "sine.inOut",
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
    const s = FIRM_TL_SCALE;
    const tl = gsap.timeline({ paused: true });
    tl.to(imageWrap, { width: "58%", duration: 0.11 * s, ease: "none" }, 0);
    tl.to(
      contentPanel,
      { xPercent: 0, autoAlpha: 1, duration: 0.11 * s, ease: "none" },
      0
    );
    tl.to(
      imageDesc,
      { autoAlpha: 1, y: 0, duration: 0.06 * s, ease: "none" },
      0.04 * s
    );
    tl.to(
      imageDesc,
      { autoAlpha: 0, y: 20, duration: 0.07 * s, ease: "power2.inOut" },
      0.13 * s
    );
    tl.to(
      splitWrap,
      { yPercent: 130, duration: 0.11 * s, ease: "power2.inOut" },
      0.13 * s
    );
    tl.to(
      principlesStage,
      { yPercent: 0, duration: 0.11 * s, ease: "power2.inOut" },
      0.13 * s
    );
    tl.to(
      principlesStage,
      {
        xPercent: -100,
        autoAlpha: 0,
        duration: 0.1 * s,
        ease: "power2.inOut",
      },
      0.26 * s
    );
    tl.to(
      dualCardsStage,
      { autoAlpha: 1, duration: 0.05 * s, ease: "power1.out" },
      0.3 * s
    );
    tl.to(
      dualLeft,
      { x: 0, autoAlpha: 1, duration: 0.11 * s, ease: "power3.out" },
      0.3 * s
    );
    tl.to(
      dualRight,
      { x: 0, autoAlpha: 1, duration: 0.11 * s, ease: "power3.out" },
      0.3 * s
    );
    tl.to(
      dualCardsStage,
      {
        yPercent: -130,
        autoAlpha: 0,
        duration: 0.1 * s,
        ease: "power2.inOut",
      },
      0.44 * s
    );
    tl.to(
      complexStage,
      { autoAlpha: 1, duration: 0.05 * s, ease: "power1.out" },
      0.54 * s
    );
    tl.to(
      complexHeading,
      { y: 0, autoAlpha: 1, duration: 0.13 * s, ease: "power2.out" },
      0.54 * s
    );
    tl.to(
      complexHeading,
      { y: -100, autoAlpha: 0, duration: 0.08 * s, ease: "power2.inOut" },
      0.69 * s
    );
    tl.to(
      complexCards,
      { y: 0, autoAlpha: 1, duration: 0.11 * s, ease: "power2.out" },
      0.76 * s
    );
    // Stage 5 → 6: complex exits, short hold, then closing (tighter than 1.29s total)
    const complexExitT = 0.89 * s;
    const complexExitDur = 0.12 * s;
    const closingEnterT = complexExitT + complexExitDur;
    const closingEnterDur = 0.11 * s;
    tl.to(
      complexStage,
      {
        yPercent: -100,
        autoAlpha: 0,
        duration: complexExitDur,
        ease: "power2.inOut",
      },
      complexExitT
    );
    tl.to(
      persistentTitle,
      {
        y: -window.innerHeight * 1.2,
        autoAlpha: 0,
        duration: complexExitDur,
        ease: "power2.inOut",
      },
      complexExitT
    );
    tl.to(
      closingStage,
      {
        xPercent: 0,
        autoAlpha: 1,
        duration: closingEnterDur,
        ease: "power2.out",
      },
      closingEnterT
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
              className="object-cover object-center brightness-[0.5] saturate-[0.30]"
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
          {/* min(52vh,cap): on tall screens the 400px cap was too small — scale cap + vh on lg+ so ~3 cards fit */}
          <div className="relative w-full min-h-[min(52vh,400px)] 2xl:min-h-[min(65vh,720px)]">
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
            <p className="mx-auto mb-10 max-w-[700px] text-[18px] leading-[166%] text-white">
              Today, CP | LEX continues to advise Italian and international
              clients across key commercial, industrial, financial, and
              technology sectors.
            </p>
            <button
              onClick={onBack}
              className="cursor-pointer mx-auto flex w-full items-center justify-center group text-xs uppercase tracking-[2px] text-white pb-1 transition-all duration-300"
            >
              <span className="group-hover:underline">
                Back to exploring other sections
              </span>
              <span className="pl-1 group-hover:pl-3 transition-all duration-300">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
      <nav
        className="flex w-full shrink-0 overflow-hidden bg-[#121111]"
        style={SUBNAV_MIN_STYLE}
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
