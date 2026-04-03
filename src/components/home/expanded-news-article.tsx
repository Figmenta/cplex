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
  const others = NEWS_ITEMS.filter((n) => n.id !== item.id).slice(0, 4);

  return (
    <div
      className="flex h-full min-h-0 flex-col bg-background"
      style={{ viewTransitionName: HOME_VT.news, borderRadius: 0 }}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row md:items-stretch">
        <article className="flex min-h-0 min-w-0 flex-[1.7] flex-col overflow-y-auto bg-[#111F3F] px-6 pt-5 md:px-10">
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
              quality={90}
              priority
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
        <aside className="flex min-h-0 w-full shrink-0 flex-col overflow-hidden md:w-[30%] md:min-w-0">
          <h4 className="shrink-0 px-6 pb-2 pt-6 text-[22px] text-foreground">
            Other news
          </h4>
          <ul className="popup-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
            {others.map((n) => (
              <li key={n.id} className="">
                <button
                  type="button"
                  onClick={() => onSelectArticle(n.id)}
                  className="cursor-pointer w-full px-6 py-4 hover:bg-[#14244A66] border-b-[0.5px] border-[#8A8A8A]/50 last:border-0 text-left text-xs text-foreground md:text-[14px] leading-[190%]"
                >
                  <p className="line-clamp-3">{n.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                    {n.date}
                  </p>
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
