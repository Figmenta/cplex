import { sectionTitle, SUBNAV_MIN_STYLE } from "@/constant/variabls";
import { HOME_VT } from "./home-view-transition";
import { HomeNewsMarquee } from "./home-news-marquee";
import { BackButton } from "./back-button";

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
        className="flex w-full shrink-0 items-center gap-2 overflow-hidden px-6 md:px-10 bg-[#121111]"
        style={SUBNAV_MIN_STYLE}
      >
        <BackButton onClick={onBack} />
      </nav>
    </div>
  );
}
