import { FIRM_TABS } from "./content";
import { cn } from "@/lib/utils";
import { subnavFirmSegmentClass } from "@/constant/variabls";
import Image from "next/image";

export function FirmSubnavWithProgress({
  activeTab,
  progressPercent,
  onTabClick,
  onBack,
}: {
  activeTab: (typeof FIRM_TABS)[number]["id"];
  progressPercent: number;
  onTabClick: (id: (typeof FIRM_TABS)[number]["id"]) => void;
  onBack: () => void;
}) {
  const segmentSpan = 100 / 6;
  /**
   * Column s (0..5) is fully covered when progress reaches the end of that column.
   * Columns:
   * 0 Back, 1..4 firm tabs, 5 trailing empty column.
   */
  const segmentFilled = (s: number) =>
    progressPercent >= (s + 1) * segmentSpan - 0.01;

  const progressFill = (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 z-0 bg-gradient-to-r from-[#0C152A] to-[#0646D0] transition-[width] duration-200 ease-out"
      style={{ width: `${progressPercent}%` }}
    />
  );

  const backButtonDesktop = (
    <button
      type="button"
      onClick={onBack}
      className={cn(
        subnavFirmSegmentClass,
        "gap-2 bg-transparent font-semibold",
        segmentFilled(0)
          ? "text-white"
          : "text-muted-foreground hover:text-foreground/90"
      )}
    >
      <Image
        src="/icons/back-2.svg"
        alt=""
        width={16}
        height={16}
        className="h-4 w-4 shrink-0"
      />
      <span className="min-w-0 leading-tight">Back to home</span>
    </button>
  );

  const tabButtons = (options: { mobile: boolean }) =>
    FIRM_TABS.map((t, i) => {
      const isActive = activeTab === t.id;
      const s = 1 + i;
      const onFilledPortion = segmentFilled(s);
      return (
        <button
          key={t.id}
          type="button"
          onClick={() => onTabClick(t.id)}
          aria-current={isActive ? "page" : undefined}
          className={cn(
            subnavFirmSegmentClass,
            options.mobile &&
              "min-h-0 shrink-0 self-stretch whitespace-nowrap px-3 py-0 text-nowrap",
            onFilledPortion || isActive ? "font-semibold" : "font-normal",
            "text-white"
          )}
        >
          {t.label}
        </button>
      );
    });

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
      {progressFill}

      {/* Desktop / tablet: 6-column grid (unchanged) */}
      <div className="relative z-10 hidden h-full min-h-0 w-full md:grid md:grid-cols-6">
        {backButtonDesktop}
        {tabButtons({ mobile: false })}
        <div aria-hidden className="min-h-0 min-w-0" />
      </div>

      {/* Mobile: fixed back column + scroll strip (matches expanded-expertise) */}
      <div className="relative z-10 flex h-full min-h-0 w-full min-w-0 items-stretch overflow-hidden md:hidden">
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "flex min-h-0 shrink-0 items-center justify-center gap-2 self-stretch border-r border-white/10 bg-transparent px-3 py-0 text-center text-[10px] font-semibold uppercase leading-tight tracking-wide transition-colors hover:opacity-90",
            segmentFilled(0)
              ? "text-white"
              : "text-muted-foreground hover:text-foreground/90"
          )}
        >
          <Image
            src="/icons/back-2.svg"
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 shrink-0"
          />
          <span className="sr-only">Back to home</span>
        </button>
        <div className="min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex h-full min-h-0 min-w-max flex-nowrap items-stretch gap-x-px px-0.5">
            {tabButtons({ mobile: true })}
            <div aria-hidden className="w-10 min-w-10 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
