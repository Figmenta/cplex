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
import { subnavPrimaryBtnClass } from "@/constant/variabls";
import { sectionTitle } from "@/constant/variabls";
import { IMAGE_OUR_PROFESSIONALS } from "./content";

/** Timeline: hero 0–1s, cards 1–1.4s → hero ends at 1/1.4 ≈ 0.714 */
const HEADER_BG_THRESHOLD = 0.72;
const TEAM_STAGE_SCROLL_THRESHOLD = 0.75;

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
  /** Solid bar under title: only after hero finishes exiting forward; hidden first when returning to stage 1 hero */
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

      const duration = 1.35;
      const ease = "power2.inOut";

      if (target === 1) {
        setShowHeaderBg(false);
        scrubTweenRef.current = gsap.to(tl, {
          progress: targetProgress,
          duration,
          ease,
          overwrite: true,
          onUpdate: () => {
            const p = tl.progress();
            syncUiFromProgress(p);
            setShowHeaderBg(p >= HEADER_BG_THRESHOLD);
          },
          onComplete: () => {
            scrubTargetRef.current = targetProgress;
            setProfessionalsStageIndex(1);
            setShowHeaderBg(true);
          },
        });
      } else {
        setShowHeaderBg(false);
        scrubTweenRef.current = gsap.to(tl, {
          progress: targetProgress,
          duration,
          ease,
          delay: 0.14,
          overwrite: true,
          onUpdate: () => {
            syncUiFromProgress(tl.progress());
          },
          onComplete: () => {
            scrubTargetRef.current = targetProgress;
            setProfessionalsStageIndex(0);
            setShowHeaderBg(false);
          },
        });
      }
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
    gsap.set(heroPhoto, { xPercent: 0 });
    const tl = gsap.timeline({ paused: true });
    // Fully clear the hero off-screen left (100% = one full width; small extra margin for edges)
    tl.to(
      heroPhoto,
      {
        xPercent: -108,
        duration: 1,
        ease: "power2.inOut",
      },
      0
    );
    // Cards only after hero — then header bg is driven by progress in animateToStage
    tl.to(
      cardsStage,
      {
        autoAlpha: 1,
        duration: 0.4,
        ease: "power2.out",
      },
      1
    );
    timelineRef.current = tl;
    scrubTargetRef.current = 0;
    setProfessionalsStageIndex(0);
    setShowHeaderBg(false);
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
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-32 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="grid grid-cols-3 w-full px-6 md:px-10">
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
                  <div>
                    <h3 className="text-[18px] font-medium leading-[35px] text-white">
                      {item.name}
                    </h3>
                    {item.role ? (
                      <p className="text-[18px] leading-[35px] text-muted-foreground">
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
              className="absolute inset-y-0 right-0 z-40 flex w-[70%] flex-col overflow-y-auto bg-[#111F3F] px-6 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ visibility: "hidden" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClosePanel}
                className="cursor-pointer flex items-center gap-2 pb-3 pt-7 mb-3"
              >
                <Image src="/icons/back-2.svg" alt="" width={16} height={16} />
                <span className="text-[10px] font-semibold uppercase tracking-[1.3px]">
                  Back to team
                </span>
              </button>
              <div className="flex min-h-0 flex-1 gap-6 overflow-hidden pb-8">
                <div className="relative h-[212px] w-[200px] shrink-0 overflow-hidden rounded-[8px]">
                  <Image
                    src={selectedDetail.image}
                    alt={selectedDetail.name}
                    fill
                    className="object-cover object-top"
                    sizes="200px"
                    quality={90}
                  />
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <h3 className="text-[22px] font-semibold leading-none">
                    {selectedDetail.name}
                  </h3>
                  <p className="mb-4 mt-2 text-[18px] text-muted-foreground">
                    {selectedDetail.role}
                  </p>
                  {selectedDetail.bioFormat === "prose" ? (
                    <div className="max-w-[771px]">
                      {(selectedDetail.proseBio ?? "")
                        .split("\n\n")
                        .map((paragraph) => (
                          <p
                            key={paragraph.slice(0, 30)}
                            className="mb-6 text-[18px] leading-[30px] text-[#D9D9D9]"
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
        className={cn(subnavRowClass, "bg-background")}
        style={SUBNAV_MIN_STYLE}
      >
        <BackButton onClick={onBack} />
        {professionalsStageIndex === 0 && !selectedSlug ? (
          <button
            type="button"
            onClick={() => animateToStage(1)}
            className={subnavPrimaryBtnClass}
          >
            View team
          </button>
        ) : null}
      </nav>
    </div>
  );
}
