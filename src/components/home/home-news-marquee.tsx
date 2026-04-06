"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { NEWS_ITEMS } from "./content";

const DEFAULT_HIGHLIGHT_ID = "helios-atlas";

/** Pixels of wheel delta for one snap — expanded index. */
const WHEEL_ACCUM_PER_SNAP = 140;
/** Compact grid: lower threshold so trackpads/mice move the carousel. */
const WHEEL_ACCUM_COMPACT = 48;

function normalizeWheelDelta(e: WheelEvent): number {
  let d = e.deltaY !== 0 ? e.deltaY : e.deltaX;
  if (e.deltaMode === 1) d *= 16;
  if (e.deltaMode === 2) d *= 800;
  return d;
}

/** Wheel delta along Embla’s scroll axis (vertical: Y, horizontal: prefer X for trackpads). */
function wheelDeltaAlongAxis(
  e: WheelEvent,
  orientation: "horizontal" | "vertical"
): number {
  if (orientation === "vertical") {
    return normalizeWheelDelta(e);
  }
  const ax = Math.abs(e.deltaX);
  const ay = Math.abs(e.deltaY);
  if (ax > ay && ax > 0.5) return e.deltaX;
  return normalizeWheelDelta(e);
}

type HomeNewsMarqueeProps = {
  compact?: boolean;
  interactive?: boolean;
  onSelect?: (id: string) => void;
  highlightId?: string;
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Home grid (compact): horizontal ticker on mobile, vertical on md+.
 * Expanded news index: Embla vertical carousel only.
 */
export function HomeNewsMarquee({
  compact = false,
  interactive = true,
  onSelect,
  highlightId = DEFAULT_HIGHLIGHT_ID,
}: HomeNewsMarqueeProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (compact) {
    return (
      <CompactNewsTicker
        interactive={interactive}
        onSelect={onSelect}
        highlightId={highlightId}
        prefersReducedMotion={prefersReducedMotion}
      />
    );
  }

  return (
    <ExpandedNewsCarousel
      interactive={interactive}
      onSelect={onSelect}
      highlightId={highlightId}
      prefersReducedMotion={prefersReducedMotion}
    />
  );
}

function CompactNewsTicker({
  interactive,
  onSelect,
  highlightId,
  prefersReducedMotion,
}: {
  interactive: boolean;
  onSelect?: (id: string) => void;
  highlightId: string;
  prefersReducedMotion: boolean;
}) {
  const fadeH = "h-8";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isMd = useMediaQuery("(min-width: 768px)");
  /** Vertical until mounted so SSR + first paint match; then mobile uses horizontal strip. */
  const orientation: "horizontal" | "vertical" =
    mounted && !isMd ? "horizontal" : "vertical";
  const isHorizontalCompact = orientation === "horizontal";

  const [api, setApi] = useState<CarouselApi | null>(null);

  const plugins = useMemo(
    () =>
      prefersReducedMotion
        ? []
        : [
            AutoScroll({
              speed: isHorizontalCompact ? 0.85 : 0.42,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
              playOnInit: true,
            }),
          ],
    [prefersReducedMotion, isHorizontalCompact]
  );

  /** Compact vertical (desktop grid): Embla viewport needs a bounded flex height; re-measure after layout. */
  useEffect(() => {
    if (!api || prefersReducedMotion || isHorizontalCompact) return;
    const autoScroll = api.plugins()?.autoScroll;
    let cancelled = false;
    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        if (cancelled) return;
        api.reInit();
        autoScroll?.play?.(0);
      });
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [api, prefersReducedMotion, isHorizontalCompact]);

  useEffect(() => {
    if (!api || prefersReducedMotion) return;
    const root = api.rootNode();
    const autoScroll = api.plugins()?.autoScroll;
    let resumeTimer: number | null = null;
    let accum = 0;

    const scheduleResumeMarquee = () => {
      if (resumeTimer !== null) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        resumeTimer = null;
        accum = 0;
        autoScroll?.play?.(0);
      }, 750);
    };

    const onWheel = (e: WheelEvent) => {
      const delta = wheelDeltaAlongAxis(e, orientation);
      if (Math.abs(delta) < 0.5) return;

      e.preventDefault();
      autoScroll?.stop?.();

      accum += delta;
      const step = WHEEL_ACCUM_COMPACT;
      while (accum <= -step) {
        api.scrollPrev();
        accum += step;
      }
      while (accum >= step) {
        api.scrollNext();
        accum -= step;
      }
      scheduleResumeMarquee();
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      root.removeEventListener("wheel", onWheel);
      if (resumeTimer !== null) window.clearTimeout(resumeTimer);
    };
  }, [api, prefersReducedMotion, orientation]);

  const marqueeItems = useMemo(() => {
    if (NEWS_ITEMS.length === 0) return [];
    const minSlides = isHorizontalCompact ? 36 : 48;
    const repeatCount = Math.max(6, Math.ceil(minSlides / NEWS_ITEMS.length));
    return Array.from({ length: repeatCount }, (_, repeatIndex) =>
      NEWS_ITEMS.map((item) => ({ item, repeatIndex }))
    ).flat();
  }, [isHorizontalCompact]);

  const itemPadV = "pt-1.5";
  const contentGapV = "-mt-1.5";

  if (prefersReducedMotion) {
    return (
      <div
        className="relative flex w-full min-h-0 flex-col overflow-hidden md:flex-1 md:px-2"
        aria-label="News"
      >
        <div className="relative shrink-0 md:hidden">
          <div
            className={cn(
              "pointer-events-none absolute top-0 right-0 left-0 z-10 bg-linear-to-b from-[#0A1225] to-transparent",
              fadeH
            )}
          />
          <div className="flex max-h-[36px] min-h-0 flex-col overflow-y-auto overscroll-y-contain">
            {NEWS_ITEMS.map((item) => (
              <div key={item.id} className="h-[36px] shrink-0">
                <CompactHorizontalSlide
                  item={item}
                  interactive={interactive}
                  onSelect={onSelect}
                />
              </div>
            ))}
          </div>
          <div
            className={cn(
              "pointer-events-none absolute right-0 bottom-0 left-0 z-10 bg-linear-to-t from-[#0A1225] to-transparent",
              fadeH
            )}
          />
        </div>

        <div className="relative hidden min-h-0 flex-1 flex-col md:flex">
          <div
            className={cn(
              "pointer-events-none absolute top-0 right-0 left-0 z-10 bg-linear-to-b from-[#0A1225] to-transparent",
              fadeH
            )}
          />
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
            {NEWS_ITEMS.map((item) => (
              <CompactVerticalSlide
                key={item.id}
                item={item}
                highlightId={highlightId}
                interactive={interactive}
                onSelect={onSelect}
              />
            ))}
          </div>
          <div
            className={cn(
              "pointer-events-none absolute right-0 bottom-0 left-0 z-10 bg-linear-to-t from-[#0A1225] to-transparent",
              fadeH
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <Carousel
      key={orientation}
      setApi={setApi}
      orientation={orientation}
      opts={{
        align: "start",
        loop: true,
        dragFree: false,
        slidesToScroll: 1,
        skipSnaps: false,
      }}
      plugins={plugins}
      className={cn(
        "relative flex min-h-0 w-full flex-col",
        isHorizontalCompact
          ? "max-md:h-[36px] max-md:min-h-0 max-md:flex-none max-md:overflow-hidden max-md:touch-pan-x"
          : "min-h-0 flex-1 md:min-h-0 md:touch-pan-y",
        "md:px-2"
      )}
      aria-label="News"
    >
      {!isHorizontalCompact ? (
        <>
          <div
            className={cn(
              "pointer-events-none absolute top-0 right-0 left-0 z-10 bg-linear-to-b from-[#0A1225] to-transparent",
              fadeH
            )}
          />
          <CarouselContent
            className={cn(
              "flex h-full max-h-full min-h-0 flex-col",
              contentGapV
            )}
          >
            {marqueeItems.map(({ item, repeatIndex }, idx) => {
              const isHighlight = item.id === highlightId;
              const cardBase = `w-full text-left ${
                isHighlight ? "px-2 py-1.5" : "px-2 py-1"
              }`;

              const body = (
                <>
                  <p className="font-medium uppercase tracking-wider text-news-accent text-[7px] md:text-[10px]">
                    {item.date}
                  </p>
                  <p className="mt-0.5 line-clamp-3 text-[8px] leading-snug text-foreground md:text-xs">
                    {item.title}
                  </p>
                </>
              );

              return (
                <CarouselItem
                  key={`${item.id}-${repeatIndex}-${idx}`}
                  className={cn(
                    "min-h-0 w-full shrink-0 grow-0 !basis-auto pl-0",
                    itemPadV
                  )}
                >
                  {interactive && onSelect ? (
                    <button
                      type="button"
                      onClick={() => onSelect(item.id)}
                      className={`cursor-pointer ${cardBase} hover:bg-[#14244A66]`}
                    >
                      {body}
                    </button>
                  ) : (
                    <div className={cardBase}>{body}</div>
                  )}
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div
            className={cn(
              "pointer-events-none absolute right-0 bottom-0 left-0 z-10 bg-linear-to-t from-[#0A1225] to-transparent",
              fadeH
            )}
          />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-6 bg-linear-to-r from-[#0A1225] to-transparent" />
          <CarouselContent className="-ml-0 flex h-[36px] min-h-0 max-h-[36px] flex-row items-center gap-x-0.5">
            {marqueeItems.map(({ item, repeatIndex }, idx) => {
              /** Content-width slides + max cap — avoids huge empty band between fixed 64vw-wide cards. */
              const cardBase =
                "inline-flex h-[36px] max-w-[min(92vw,280px)] min-w-0 shrink-0 items-center px-1 py-0 text-left";

              const body = (
                <p className="line-clamp-1 min-w-0 text-[12px] leading-tight text-foreground">
                  {/* <span className="font-medium uppercase tracking-wider text-news-accent">
                    {item.date}
                  </span> */}
                  <span className="text-[#D54561]">{" "}·{" "}</span>
                  <span>{item.title}</span>
                </p>
              );

              return (
                <CarouselItem
                  key={`${item.id}-${repeatIndex}-${idx}`}
                  className="min-h-0 w-max min-w-0 shrink-0 grow-0 !basis-auto !pl-0"
                >
                  {interactive && onSelect ? (
                    <button
                      type="button"
                      onClick={() => onSelect(item.id)}
                      className={`cursor-pointer ${cardBase} hover:bg-[#14244A66]`}
                    >
                      {body}
                    </button>
                  ) : (
                    <div className={cardBase}>{body}</div>
                  )}
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-6 bg-linear-to-l from-[#0A1225] to-transparent" />
        </>
      )}
    </Carousel>
  );
}

function CompactHorizontalSlide({
  item,
  interactive,
  onSelect,
}: {
  item: (typeof NEWS_ITEMS)[number];
  interactive: boolean;
  onSelect?: (id: string) => void;
}) {
  const cardBase =
    "inline-flex h-[36px] max-w-[min(92vw,280px)] min-w-0 shrink-0 items-center px-1 py-0 text-left";
  const body = (
    <p className="line-clamp-1 min-w-0 text-[8px] leading-tight text-foreground">
      <span className="font-medium uppercase tracking-wider text-news-accent">
        {item.date}
      </span>
      <span className="text-news-accent"> · </span>
      <span>{item.title}</span>
    </p>
  );
  if (interactive && onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(item.id)}
        className={`cursor-pointer ${cardBase} hover:bg-[#14244A66]`}
      >
        {body}
      </button>
    );
  }
  return <div className={cardBase}>{body}</div>;
}

function CompactVerticalSlide({
  item,
  highlightId,
  interactive,
  onSelect,
}: {
  item: (typeof NEWS_ITEMS)[number];
  highlightId: string;
  interactive: boolean;
  onSelect?: (id: string) => void;
}) {
  const isHighlight = item.id === highlightId;
  const cardBase = cn(
    "w-full text-left",
    isHighlight ? "px-2 py-1.5" : "px-2 py-1"
  );
  const body = (
    <>
      <p className="font-medium uppercase tracking-wider text-news-accent text-[7px] md:text-[10px]">
        {item.date}
      </p>
      <p className="mt-0.5 line-clamp-3 text-[8px] leading-snug text-foreground md:text-xs">
        {item.title}
      </p>
    </>
  );
  if (interactive && onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(item.id)}
        className={`cursor-pointer ${cardBase} hover:bg-[#14244A66]`}
      >
        {body}
      </button>
    );
  }
  return <div className={cardBase}>{body}</div>;
}

function ExpandedNewsCarousel({
  interactive,
  onSelect,
  highlightId,
  prefersReducedMotion,
}: {
  interactive: boolean;
  onSelect?: (id: string) => void;
  highlightId: string;
  prefersReducedMotion: boolean;
}) {
  const [api, setApi] = useState<CarouselApi | null>(null);

  const plugins = useMemo(
    () =>
      prefersReducedMotion
        ? []
        : [
            AutoScroll({
              speed: 0.4,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
              playOnInit: true,
            }),
          ],
    [prefersReducedMotion]
  );

  useEffect(() => {
    if (!api || prefersReducedMotion) return;
    const autoScroll = api.plugins()?.autoScroll;
    const id = window.requestAnimationFrame(() => {
      api.reInit();
      autoScroll?.play?.(0);
    });
    return () => window.cancelAnimationFrame(id);
  }, [api, prefersReducedMotion]);

  useEffect(() => {
    if (!api || prefersReducedMotion) return;
    const root = api.rootNode();
    const autoScroll = api.plugins()?.autoScroll;
    let resumeTimer: number | null = null;
    let accum = 0;

    const scheduleResumeMarquee = () => {
      if (resumeTimer !== null) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        resumeTimer = null;
        accum = 0;
        autoScroll?.play?.(0);
      }, 750);
    };

    const onWheel = (e: WheelEvent) => {
      const delta = normalizeWheelDelta(e);
      if (Math.abs(delta) < 0.5) return;

      e.preventDefault();
      autoScroll?.stop?.();

      accum += delta;
      const step = WHEEL_ACCUM_PER_SNAP;
      while (accum <= -step) {
        api.scrollPrev();
        accum += step;
      }
      while (accum >= step) {
        api.scrollNext();
        accum -= step;
      }
      scheduleResumeMarquee();
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      root.removeEventListener("wheel", onWheel);
      if (resumeTimer !== null) window.clearTimeout(resumeTimer);
    };
  }, [api, prefersReducedMotion]);

  const marqueeItems = useMemo(() => {
    if (NEWS_ITEMS.length === 0) return [];
    const minSlides = 16;
    const repeatCount = Math.max(6, Math.ceil(minSlides / NEWS_ITEMS.length));
    return Array.from({ length: repeatCount }, (_, repeatIndex) =>
      NEWS_ITEMS.map((item) => ({ item, repeatIndex }))
    ).flat();
  }, []);

  const itemPadV = "pt-4";
  const contentGapV = "-mt-4";
  const fadeH = "h-10";

  return (
    <Carousel
      setApi={setApi}
      orientation="vertical"
      opts={{
        align: "start",
        loop: true,
        dragFree: false,
        slidesToScroll: 1,
        skipSnaps: false,
      }}
      plugins={plugins}
      className="relative flex min-h-0 w-full flex-1 flex-col px-4 md:touch-pan-y"
      aria-label="News"
    >
      <div
        className={cn(
          "pointer-events-none absolute top-0 right-0 left-0 z-10 bg-linear-to-b from-[#0A1225] to-transparent",
          fadeH
        )}
      />
      <CarouselContent
        className={cn("flex h-full max-h-full min-h-0 flex-col", contentGapV)}
      >
        {marqueeItems.map(({ item, repeatIndex }, idx) => {
          const isHighlight = item.id === highlightId;
          const cardBase = `w-full max-w-[900px] text-left outline-none transition-opacity ${
            isHighlight ? "px-4 py-3" : "px-4 py-2"
          }`;

          const body = (
            <>
              <p className="font-medium uppercase tracking-wider text-news-accent text-[12px] md:text-[16px]">
                {item.date}
              </p>
              <p className="mt-2 text-[22px] leading-snug text-foreground md:text-[18px]">
                {item.title}
              </p>
            </>
          );

          return (
            <CarouselItem
              key={`${item.id}-${repeatIndex}-${idx}`}
              className={cn(
                "min-h-0 w-full shrink-0 grow-0 !basis-auto pl-0",
                itemPadV
              )}
            >
              {interactive && onSelect ? (
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={`cursor-pointer ${cardBase} hover:bg-[#14244A66]`}
                >
                  {body}
                </button>
              ) : (
                <div className={cardBase}>{body}</div>
              )}
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div
        className={cn(
          "pointer-events-none absolute right-0 bottom-0 left-0 z-10 bg-linear-to-t from-[#0A1225] to-transparent",
          fadeH
        )}
      />
    </Carousel>
  );
}
