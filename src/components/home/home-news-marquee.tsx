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
        speed: compact ? 0.55 : 0.85,
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
