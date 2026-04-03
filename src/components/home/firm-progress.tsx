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

  const backButton = (compact: boolean) => (
    <button
      type="button"
      onClick={onBack}
      className={cn(
        subnavFirmSegmentClass,
        "gap-2 bg-transparent font-semibold",
        compact
          ? "relative z-10 shrink-0 border-r border-white/10 px-3 py-2 md:border-0 md:px-2"
          : "",
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
      <span
        className={cn("min-w-0 leading-tight", compact && "max-md:sr-only")}
      >
        Back to home
      </span>
    </button>
  );

  const tabButtons = (tabClass: string) =>
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
            tabClass,
            onFilledPortion || isActive ? "font-semibold" : "font-normal",
            "text-white"
          )}
        >
          {t.label}
        </button>
      );
    });

  return (
    <div className="relative h-full min-h-0 w-full flex-1">
      {progressFill}

      {/* Desktop / tablet: 6-column grid (unchanged) */}
      <div className="relative z-10 hidden h-full w-full min-w-0 md:grid md:grid-cols-6">
        {backButton(false)}
        {tabButtons("")}
        <div aria-hidden className="min-h-0 min-w-0" />
      </div>

      {/* Mobile: fixed back + horizontal scroll for tabs */}
      <div className="relative z-10 flex h-full w-full min-h-0 md:hidden">
        {backButton(true)}
        <div className="min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-h-full min-w-max items-stretch">
            {tabButtons("whitespace-nowrap px-4 py-2")}
            <div aria-hidden className="w-12 min-w-12 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
