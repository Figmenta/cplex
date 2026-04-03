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

  return (
    <div className="relative h-full min-h-0 w-full flex-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-[#0C152A] to-[#0646D0] transition-[width] duration-200 ease-out"
        style={{ width: `${progressPercent}%` }}
      />
      <div className="relative z-10 grid h-full w-full min-w-0 grid-cols-6">
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
        {FIRM_TABS.map((t, i) => {
          const isActive = activeTab === t.id;
          const s = 1 + i; // 1..4
          const onFilledPortion = segmentFilled(s);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabClick(t.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                subnavFirmSegmentClass,
                onFilledPortion || isActive
                  ? "font-semibold text-white"
                  : "font-normal text-muted-foreground hover:text-foreground/90"
              )}
            >
              {t.label}
            </button>
          );
        })}
        {/* trailing column to let stage 6 reach exact full width */}
        <div aria-hidden className="min-h-0 min-w-0" />
      </div>
    </div>
  );
}
