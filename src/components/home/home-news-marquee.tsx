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
 * User can drag, touch-swipe, and scroll with the wheel; interaction pauses auto-scroll.
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
        stopOnInteraction: true,
        stopOnMouseEnter: true,
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
      className="flex min-h-0 w-full flex-1 flex-col"
      aria-label="News"
    >
      <CarouselContent
        className={cn("flex h-full max-h-full min-h-0 flex-col", contentGap)}
      >
        {NEWS_ITEMS.map((item, idx) => {
          const isHighlight = item.id === highlightId;
          const cardBase = compact
            ? `w-full rounded-sm border text-left ${
                isHighlight
                  ? "border-border/40 bg-muted/25 px-2 py-1.5"
                  : "border-transparent px-2 py-1 opacity-85"
              }`
            : `w-full max-w-3xl rounded-sm border text-left outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring ${
                isHighlight
                  ? "border-border/40 bg-muted/25 px-4 py-3"
                  : "border-transparent px-4 py-2 opacity-80 hover:opacity-100"
              }`;

          const body = (
            <>
              <p
                className={`font-medium uppercase tracking-wider text-news-accent ${
                  compact ? "text-[7px] md:text-[8px]" : "text-[10px] md:text-xs"
                }`}
              >
                {item.date}
              </p>
              <p
                className={`leading-snug text-foreground ${
                  compact
                    ? "mt-0.5 text-[8px] line-clamp-3 md:text-[9px]"
                    : "mt-2 text-xs md:text-sm"
                }`}
              >
                {item.title}
              </p>
            </>
          );

          return (
            <CarouselItem
              key={`${item.id}-${idx}`}
              className={cn(
                "min-h-0 shrink-0 grow-0 basis-auto pl-0",
                itemPad
              )}
            >
              {interactive && onSelect ? (
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={cardBase}
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
    </Carousel>
  );
}
