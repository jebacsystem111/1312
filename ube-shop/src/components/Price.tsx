import { cn } from "@/lib/cn";
import { zl } from "@/lib/format";

export function Price({
  value,
  compareAt,
  className,
  size = "md",
}: {
  value: number;
  compareAt?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const scale = {
    sm: "text-[15px]",
    md: "text-[17px]",
    lg: "text-[27px] tracking-[-0.02em]",
  }[size];

  return (
    <span className={cn("inline-flex items-baseline gap-2 tnum", scale, className)}>
      <span className="font-medium text-ink">{zl(value)}</span>
      {compareAt && compareAt > value ? (
        <span className="text-[0.72em] font-normal text-ink-3 line-through decoration-ink-3/60">
          {zl(compareAt)}
        </span>
      ) : null}
    </span>
  );
}
