import { cn } from "@/lib/utils";
import { subnavPrimaryBtnClass } from "@/constant/variabls";
import Image from "next/image";

export function BackButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(subnavPrimaryBtnClass, className)}
    >
      <Image
        src="/icons/back-2.svg"
        alt="back button"
        width={16}
        height={16}
        className="h-4 w-4 shrink-0"
      />
      Back to home
    </button>
  );
}
