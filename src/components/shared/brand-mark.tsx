import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
};

export function BrandMark({ className, compact = false }: BrandMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        aria-hidden="true"
        className="relative grid size-9 place-items-center rounded-lg border border-cyan-300/25 bg-blue-600/15"
      >
        <span className="absolute left-2 top-2 h-4 w-1.5 rounded-sm bg-blue-500" />
        <span className="absolute bottom-2 right-2 h-4 w-1.5 rounded-sm bg-cyan-300" />
      </span>
      {!compact && (
        <span className="text-lg font-bold tracking-[-0.03em] text-white">
          indotek<span className="text-cyan-300">saft</span>
        </span>
      )}
    </span>
  );
}
