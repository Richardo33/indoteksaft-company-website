import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
  tone?: "light" | "dark";
};

export function BrandMark({
  className,
  compact = false,
  tone = "light",
}: BrandMarkProps) {
  if (tone === "dark") {
    return (
      <span
        className={cn("inline-flex items-center gap-2.5", className)}
        aria-label="Indoteksaft"
      >
        <Image
          src="/images/indoteksaft-mark.svg"
          alt=""
          width={30}
          height={27}
          className="h-auto w-[30px]"
        />
        {!compact && (
          <span className="text-xl font-extrabold tracking-[-0.05em] text-slate-950">
            indoteksaft
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/images/indoteksaft-logo.svg"
        alt="Indoteksaft"
        width={143}
        height={27}
        priority
        className={cn("h-auto w-[143px]", compact && "w-8 object-left object-cover")}
      />
    </span>
  );
}
