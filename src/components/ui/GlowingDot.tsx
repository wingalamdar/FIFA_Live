import { cn } from "@/lib/utils"

interface GlowingDotProps {
  className?: string;
  color?: 'green' | 'red' | 'yellow';
}

export function GlowingDot({ className, color = 'green' }: GlowingDotProps) {
  const colors = {
    green: 'bg-emerald-400 shadow-emerald-400',
    red: 'bg-red-400 shadow-red-400',
    yellow: 'bg-yellow-400 shadow-yellow-400',
  }

  return (
    <span className={cn(
      "relative flex h-2.5 w-2.5",
      className
    )}>
      <span className={cn(
        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
        colors[color]
      )} />
      <span className={cn(
        "relative inline-flex rounded-full h-2.5 w-2.5",
        colors[color]
      )} />
    </span>
  )
}
