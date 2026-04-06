import { useRef, useEffect } from "react";
import { NewsItem } from "./content";
import { NEWS_ITEMS } from "./content";
import { HOME_VT } from "./home-view-transition";
import { sectionTitle } from "@/constant/variabls";
import Image from "next/image";
import { SUBNAV_MIN_STYLE } from "@/constant/variabls";
import { BackButton } from "./back-button";
import { subnavPrimaryBtnClass } from "@/constant/variabls";

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
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (articleRef.current) {
      articleRef.current.scrollTop = 0;
    }
  }, [item.id]);

  const others = NEWS_ITEMS.filter((n) => n.id !== item.id).slice(0, 4);

  return (
    <div
      className="flex h-full min-h-0 flex-col bg-background"
      style={{ viewTransitionName: HOME_VT.news, borderRadius: 0 }}
    >
      {/* Mobile: stack article above "Other news", whole container scrolls.
          Desktop: side-by-side columns. */}
      <div
          ref={articleRef}
          className="flex flex-1 flex-col overflow-y-auto md:flex-row md:items-stretch md:min-h-0 md:overflow-hidden"
        >
        <article className="flex-none min-w-0 flex-col bg-[#111F3F] px-6 py-5 md:min-h-0 md:w-[60%] md:shrink-0 md:overflow-y-auto md:px-10">
          <div className="max-w-[900px]">
            <h2 className={`${sectionTitle} text-[#D54561] text-[11px] mt-4 md:mt-0`}>Our News</h2>
            <p className="md:mt-12 mt-2 text-[14px] uppercase tracking-wider text-[#D54561] md:text-news-accent md:text-base">
              {item.date}
            </p>
            <h3 className="mt-3 text-[26px] md:text-[32px] font-medium leading-snug text-foreground">
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
              quality={90}
              priority
            />
          </div>
          <div className="max-w-[900px] pb-8 pt-6 text-[17px] md:text-[18px] leading-relaxed text-foreground/95 md:pb-0">
            {item.body.split("\n\n").map((p) => (
              <p key={p.slice(0, 24)} className="mb-4">
                {p}
              </p>
            ))}
          </div>
        </article>
        <aside className="flex-none pb-8 w-full flex-col md:min-h-0 md:w-[40%] md:min-w-0 md:shrink-0 md:overflow-y-auto">
          <h4 className="shrink-0 px-6 pb-2 pt-6 text-[22px] text-foreground">
            Other news
          </h4>
          <ul className="flex flex-col">
            {others.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => onSelectArticle(n.id)}
                  className="cursor-pointer flex flex-col md:flex-col-reverse w-full gap-2 px-6 py-4 hover:bg-[#14244A66] border-b-[0.5px] border-[#8A8A8A]/50 last:border-0 text-left text-xs text-foreground md:text-[14px] leading-[190%]"
                >
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {n.date}
                  </p>
                  <p className="line-clamp-3 text-[16px]">{n.title}</p>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <nav
        className="flex w-full shrink-0 flex-wrap items-center gap-2 overflow-hidden bg-[#121111] px-6 md:px-10"
        style={SUBNAV_MIN_STYLE}
      >
        <BackButton onClick={onBack} />
        <button
          type="button"
          onClick={onBackToIndex}
          className={subnavPrimaryBtnClass}
        >
          News index
        </button>
      </nav>
    </div>
  );
}