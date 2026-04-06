import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import {
  PROFESSIONALS_ITEMS,
  PROFESSIONALS_DETAILS,
  PROFESSIONALS_STOPS,
} from "@/constant/variabls";
import { HOME_VT } from "./home-view-transition";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SUBNAV_MIN_STYLE, subnavRowClass } from "@/constant/variabls";
import { BackButton } from "./back-button";
import { sectionTitle } from "@/constant/variabls";
import { IMAGE_OUR_PROFESSIONALS } from "./content";

/**
 * Timeline: hero then cards; normalized progress 0–1 unchanged when scaling
 * (hero ends at 1/1.4 ≈ 0.714).
 */
const HEADER_BG_THRESHOLD = 0.72;
const TEAM_STAGE_SCROLL_THRESHOLD = 0.75;
/** Stretch hero/cards segment lengths — same idea as firm `FIRM_TL_SCALE`. */
const PROS_TL_SCALE = 1.55;
/** Wall-clock time to scrub timeline 0→1 (smooth, not rushed). */
const TEAM_SCRUB_DURATION = 2.1;
/** After opening, auto-advance to team grid (no scroll / wheel to change stage). */
const TEAM_AUTO_ADVANCE_MS = 1000;
/** Team member detail drawer: slide from right (md+) or bottom (mobile) */
const TEAM_DETAIL_PANEL_IN_DURATION = 0.5;
const TEAM_DETAIL_PANEL_OUT_DURATION = 0.4;

function isMdUpViewport(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(min-width: 768px)").matches;
}

export function ExpandedProfessionals({ onBack }: { onBack: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsScrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrubTargetRef = useRef(0);
  const scrubTweenRef = useRef<gsap.core.Tween | null>(null);
  const stageRef = useRef(0);
  /** Solid bar under title: after hero scrubs off-screen during auto-advance to team grid */
  const [showHeaderBg, setShowHeaderBg] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<
    (typeof PROFESSIONALS_ITEMS)[number]["slug"] | null
  >(null);
  const selectedDetail = selectedSlug
    ? PROFESSIONALS_DETAILS[selectedSlug]
    : null;

  const syncUiFromProgress = useCallback((progress: number) => {
    stageRef.current = progress >= TEAM_STAGE_SCROLL_THRESHOLD ? 1 : 0;
  }, []);

  /** Only forward to team grid; no return to hero (use Back to home). */
  const animateToTeamStage = useCallback(() => {
    const tl = timelineRef.current;
    if (!tl) return;
    const targetProgress = PROFESSIONALS_STOPS[1];
    if (scrubTargetRef.current >= targetProgress - 0.001) return;

    scrubTweenRef.current?.kill();
    setShowHeaderBg(false);
    scrubTweenRef.current = gsap.to(tl, {
      progress: targetProgress,
      duration: TEAM_SCRUB_DURATION,
      ease: "sine.inOut",
      overwrite: true,
      onUpdate: () => {
        const p = tl.progress();
        syncUiFromProgress(p);
        setShowHeaderBg(p >= HEADER_BG_THRESHOLD);
      },
      onComplete: () => {
        scrubTargetRef.current = targetProgress;
        setShowHeaderBg(true);
      },
    });
  }, [syncUiFromProgress]);

  const handleSelectCard = useCallback(
    (slug: (typeof PROFESSIONALS_ITEMS)[number]["slug"]) => {
      if (selectedSlug) return;
      setSelectedSlug(slug);
      requestAnimationFrame(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const desktop = isMdUpViewport();
        gsap.fromTo(
          panel,
          desktop
            ? { x: "100%", y: 0, autoAlpha: 0 }
            : { y: "100%", x: 0, autoAlpha: 0 },
          {
            x: 0,
            y: 0,
            autoAlpha: 1,
            duration: TEAM_DETAIL_PANEL_IN_DURATION,
            ease: "sine.out",
          }
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
    const desktop = isMdUpViewport();
    gsap.to(panel, {
      ...(desktop ? { x: "100%" } : { y: "100%" }),
      autoAlpha: 0,
      duration: TEAM_DETAIL_PANEL_OUT_DURATION,
      ease: "sine.in",
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
    gsap.set(heroPhoto, { xPercent: 0 });
    const s = PROS_TL_SCALE;
    const tl = gsap.timeline({ paused: true });
    // Fully clear the hero off-screen left (100% = one full width; small extra margin for edges)
    tl.to(
      heroPhoto,
      {
        xPercent: -108,
        duration: 1 * s,
        ease: "sine.inOut",
      },
      0
    );
    // Cards only after hero — header bg follows scrub progress
    tl.to(
      cardsStage,
      {
        autoAlpha: 1,
        duration: 0.4 * s,
        ease: "power2.out",
      },
      1 * s
    );
    timelineRef.current = tl;
    scrubTargetRef.current = 0;
    setShowHeaderBg(false);
    syncUiFromProgress(0);
    return () => {
      scrubTweenRef.current?.kill();
      tl.kill();
      timelineRef.current = null;
    };
  }, [syncUiFromProgress]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      animateToTeamStage();
    }, TEAM_AUTO_ADVANCE_MS);
    return () => {
      clearTimeout(id);
    };
  }, [animateToTeamStage]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const MAX_WHEEL_STEP = 60;

    const onWheel = (e: WheelEvent) => {
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
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, [selectedSlug]);

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
            className="object-cover object-[center_28%] brightness-[0.8] saturate-[0.30]"
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
        <div
          className={cn(
            "pointer-events-none absolute left-0 right-0 top-0 z-30 px-6 pt-5 pb-4 transition-colors duration-200 md:px-10 md:pt-8 md:pb-5",
            showHeaderBg && "bg-background"
          )}
        >
          <h2 className={sectionTitle}>The Professionals</h2>
        </div>
        <div
          data-anim="pros-cards-stage"
          className={cn(
            "absolute inset-0 z-20 flex min-h-0 flex-col",
            selectedSlug && "pointer-events-none"
          )}
        >
          <div
            ref={cardsScrollRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-12 md:pt-32 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="grid w-full grid-cols-2 px-6 md:grid-cols-3 gap-x-3 lg:gap-0 md:px-10">
              {PROFESSIONALS_ITEMS.map((item, index) => (
                <article
                  key={item.slug}
                  onClick={() => handleSelectCard(item.slug)}
                  className={cn(
                    "flex flex-col md:flex-row min-h-[180px] cursor-pointer items-center gap-5 border-[#22355E] py-6 md:p-6 transition-colors duration-300 hover:bg-[#14244A66]",
                    index < PROFESSIONALS_ITEMS.length - 1 && "md:border-b-[0.5px]",
                    index % 3 !== 2 && "md:border-r-[0.5px]",
                    index < PROFESSIONALS_ITEMS.length - 3 && "md:border-b-[0.5px]"
                  )}
                >
                  <div className="relative h-[123px] w-full md:w-[116px] shrink-0 overflow-hidden rounded-[5px]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover object-top grayscale transition-all duration-300 hover:grayscale-0"
                      sizes="128px"
                      quality={90}
                    />
                    <div
                      className="absolute inset-0"
                      style={{ backgroundColor: "rgba(20, 36, 74, 0.4)" }}
                    />
                  </div>
                  <div className="w-full flex min-h-0 min-w-0 flex-1 gap-1 lg:gap-0 flex-col">
                    <h3 className="leading-[100%] w-full text-[16px] md:text-[18px] font-medium text-white [text-orientation:mixed] writing-vertical-rl md:writing-horizontal-tb">
                      {item.name}
                    </h3>
                    {item.role ? (
                      <p className="text-[14px] md:text-[16px] leading-snug text-muted-foreground [text-orientation:mixed] writing-vertical-rl md:leading-[35px] md:writing-horizontal-tb">
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
              className="absolute inset-0 z-[35] cursor-pointer bg-[#0A1225]/80 backdrop-blur-md backdrop-saturate-150 transition-colors"
              onClick={handleClosePanel}
            />
            <div
              ref={panelRef}
              className={cn(
                "absolute z-40 flex flex-col bg-[#111F3F] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                "inset-x-0 bottom-0 top-0 max-h-[90dvh] w-full rounded-t-2xl px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2",
                "md:inset-x-auto md:inset-y-0 md:bottom-auto md:left-auto md:right-0 md:top-0 md:max-h-none md:h-full md:w-[70%] md:rounded-none md:px-10 md:pb-0 md:pt-0"
              )}
              style={{ visibility: "hidden" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClosePanel}
                className="mb-3 flex cursor-pointer items-center gap-2 pb-3 pt-5 md:pt-7"
              >
                <Image src="/icons/back-2.svg" alt="" width={16} height={16} />
                <span className="text-[10px] font-semibold uppercase tracking-[1.3px]">
                  Back to team
                </span>
              </button>
              <div className="flex min-h-0 flex-1 flex-col md:flex-row items-start gap-3 pb-6 md:min-h-0 md:gap-6 md:pb-8  overflow-y-auto">
                <div className="relative h-[212px] w-[200px] shrink-0 rounded-[8px]">
                  <Image
                    src={selectedDetail.image}
                    alt={selectedDetail.name}
                    fill
                    className="object-cover object-top"
                    sizes="200px"
                    quality={90}
                  />
                </div>
                <div className="flex min-h-0 min-w-0 flex-1 flex-col pr-2 md:min-h-0 ">
                  <div className="flex shrink-0 flex-col items-start gap-3 md:flex-col md:gap-2">
                    <h3 className="mt-2 lg:mt-0 text-[32px] md:text-[22px] font-semibold leading-none [text-orientation:mixed] writing-vertical-rl md:writing-horizontal-tb">
                      {selectedDetail.name}
                    </h3>
                    <p className="text-[18px] text-muted-foreground [text-orientation:mixed] writing-vertical-rl md:mb-4 md:mt-2 md:writing-horizontal-tb">
                      {selectedDetail.role}
                    </p>
                  </div>
                  <div className="mt-4 min-w-0 md:mt-0">
                  {selectedDetail.bioFormat === "prose" ? (
                    <div className="max-w-[771px]">
                      {(selectedDetail.proseBio ?? "")
                        .split("\n\n")
                        .map((paragraph) => (
                          <p
                            key={paragraph.slice(0, 30)}
                            className="mb-6 text-[20px] md:text-[18px] leading-[30px] text-white md:text-[#D9D9D9]"
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
            </div>
          </>
        )}
      </div>
      <nav style={{ minHeight: "var(--home-subnav-height)" }} className="flex w-full shrink-0 overflow-hidden bg-[#121111]">
        <button
          type="button"
          onClick={onBack}
          className="flex w-fit shrink-0 items-center gap-2 px-6 md:px-12 cursor-pointer py-1 text-[10px] uppercase tracking-wide hover:opacity-90 md:text-[11px] font-semibold transition-all h-full"
        >
          <Image
            src="/icons/back-2.svg"
            alt="back button"
            width={16}
            height={16}
            className="h-4 w-4 shrink-0"
          />
          Back to home
        </button>
      </nav>
    </div>
  );
}
