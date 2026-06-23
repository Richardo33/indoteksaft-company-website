import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
};

export function BrandMark({ className, compact = false }: BrandMarkProps) {
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
