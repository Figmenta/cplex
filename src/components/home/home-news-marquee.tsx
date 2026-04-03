"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { NEWS_ITEMS } from "./content";

const DEFAULT_HIGHLIGHT_ID = "helios-atlas";

type HomeNewsMarqueeProps = {
  compact?: boolean;
  interactive?: boolean;
  onSelect?: (id: string) => void;
  highlightId?: string;
};

/**
 * Vertical news strip: shadcn Carousel (Embla) + AutoScroll for marquee motion.
 * We repeat a short source list so the marquee feels truly continuous.
 */
export function HomeNewsMarquee({
  compact = false,
  interactive = true,
  onSelect,
  highlightId = DEFAULT_HIGHLIGHT_ID,
}: HomeNewsMarqueeProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);

  const plugins = useMemo(
    () => [
      AutoScroll({
        // Lower = slower scroll (px/frame style; tuned for readable marquee)
        speed: compact ? 0.25 : 0.40,
        // Keep marquee continuously moving in both compact and expanded layouts.
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        playOnInit: true,
      }),
    ],
    [compact]
  );

  useEffect(() => {
    if (!api) return;
    const root = api.rootNode();
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) api.scrollNext();
      else api.scrollPrev();
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [api]);

  const itemPad = compact ? "pt-1.5" : "pt-4";
  const contentGap = compact ? "-mt-1.5" : "-mt-4";
  const marqueeItems = useMemo(() => {
    if (NEWS_ITEMS.length === 0) return [];
    // Ensure enough physical slides for a convincing "never ending" loop.
    const minSlides = compact ? 20 : 16;
    const repeatCount = Math.max(4, Math.ceil(minSlides / NEWS_ITEMS.length));
    return Array.from({ length: repeatCount }, (_, repeatIndex) =>
      NEWS_ITEMS.map((item) => ({ item, repeatIndex }))
    ).flat();
  }, [compact]);

  return (
    <Carousel
      setApi={setApi}
      orientation="vertical"
      opts={{
        align: "start",
        loop: true,
        dragFree: false,
      }}
      plugins={plugins}
      className={`relative flex min-h-0 w-full flex-1 flex-col ${compact ? "md:px-2" : "px-4"}`}
      aria-label="News"
    >
      <div
        className={`absolute top-0 left-0 right-0 h-${compact ? "8" : "10"} z-10 pointer-events-none bg-linear-to-b from-[#0A1225] to-transparent`}
      />
      <CarouselContent
        className={cn("flex h-full max-h-full min-h-0 flex-col", contentGap)}
      >
        {marqueeItems.map(({ item, repeatIndex }, idx) => {
          const isHighlight = item.id === highlightId;
          const cardBase = compact
            ? `w-full text-left ${isHighlight ? "px-2 py-1.5" : "px-2 py-1"}`
            : `w-full max-w-[900px] text-left outline-none transition-opacity ${
                isHighlight ? "px-4 py-3" : "px-4 py-2"
              }`;

          const body = (
            <>
              <p
                className={`font-medium uppercase tracking-wider text-news-accent ${
                  compact
                    ? "text-[7px] md:text-[10px]"
                    : "text-[10px] md:text-[16px]"
                }`}
              >
                {item.date}
              </p>
              <p
                className={`leading-snug text-foreground ${
                  compact
                    ? "mt-0.5 text-[8px] line-clamp-3 md:text-xs"
                    : "mt-2 text-xs md:text-[18px]"
                }`}
              >
                {item.title}
              </p>
            </>
          );

          return (
            <CarouselItem
              key={`${item.id}-${repeatIndex}-${idx}`}
              className={cn("min-h-0 shrink-0 grow-0 basis-auto pl-0", itemPad)}
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
        className={`absolute bottom-0 left-0 right-0 h-${compact ? "8" : "10"} z-10 pointer-events-none bg-linear-to-t from-[#0A1225] to-transparent`}
      />
    </Carousel>
  );
}

/**
 * "Other news" column in expanded article view: same Embla + AutoScroll loop as HomeNewsMarquee,
 * but only items other than the current article, with sidebar styling.
 */
export function NewsArticleOtherNewsMarquee({
  excludeId,
  onSelect,
}: {
  excludeId: string;
  onSelect: (id: string) => void;
}) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const baseItems = useMemo(
    () => NEWS_ITEMS.filter((n) => n.id !== excludeId),
    [excludeId]
  );

  const plugins = useMemo(
    () => [
      AutoScroll({
        speed: 0.28,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        playOnInit: true,
      }),
    ],
    []
  );

  const marqueeItems = useMemo(() => {
    if (baseItems.length === 0) return [];
    const minSlides = 16;
    const repeatCount = Math.max(4, Math.ceil(minSlides / baseItems.length));
    return Array.from({ length: repeatCount }, (_, repeatIndex) =>
      baseItems.map((item) => ({ item, repeatIndex }))
    ).flat();
  }, [baseItems]);

  useEffect(() => {
    if (!api) return;
    const root = api.rootNode();
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) api.scrollNext();
      else api.scrollPrev();
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const onScroll = () => setScrollProgress(api.scrollProgress());
    api.on("scroll", onScroll);
    api.on("reInit", onScroll);
    onScroll();
    return () => {
      api.off("scroll", onScroll);
      api.off("reInit", onScroll);
    };
  }, [api]);

  if (baseItems.length === 0) return null;

  return (
    <Carousel
      setApi={setApi}
      orientation="vertical"
      opts={{
        align: "start",
        loop: true,
        dragFree: false,
      }}
      plugins={plugins}
      className="relative flex min-h-0 w-full flex-1 flex-col pr-1"
      aria-label="Other news"
    >
      {/* Embla viewport is overflow:hidden — native scrollbar cannot show; track + thumb match .popup-scroll */}
      <div
        className="pointer-events-none absolute right-0 top-8 bottom-8 z-20 w-2"
        aria-hidden
      >
        <div className="h-full w-full rounded-full bg-white/10" />
        <div
          className="absolute left-0 w-full rounded-full bg-white/35 transition-[top] duration-75 ease-out"
          style={{
            height: "28%",
            top: `${scrollProgress * 72}%`,
          }}
        />
      </div>
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-8 bg-linear-to-b from-[#0B1327] to-transparent" />
      <CarouselContent className="-mt-3 flex min-h-0 flex-col">
        {marqueeItems.map(({ item, repeatIndex }, idx) => (
          <CarouselItem
            key={`${item.id}-${repeatIndex}-${idx}`}
            className="min-h-0 shrink-0 grow-0 basis-auto pl-0 pt-3"
          >
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className="w-full cursor-pointer border-b border-border/10 pb-3 text-left last:border-0"
            >
              <span className="block text-xs text-foreground hover:underline md:text-[16px]">
                {item.title.length > 90
                  ? `${item.title.slice(0, 90)}…`
                  : item.title}
              </span>
              <span className="mt-1 block text-sm uppercase tracking-wide text-muted-foreground">
                {item.date}
              </span>
            </button>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-8 bg-linear-to-t from-[#0B1327] to-transparent" />
    </Carousel>
  );
}
