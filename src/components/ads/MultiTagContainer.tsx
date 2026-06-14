'use client';
import { cn } from "@/lib/utils"

interface MultiTagProps {
  className?: string;
  count?: number;
  layout?: 'grid' | 'stack' | 'inline';
}

export function MultiTagContainer({ className, count = 3, layout = 'stack' }: MultiTagProps) {
  const layouts = {
    grid: 'grid grid-cols-1 sm:grid-cols-3 gap-4',
    stack: 'flex flex-col gap-4',
    inline: 'flex flex-row gap-4 overflow-x-auto',
  }

  return (
    <div className={cn(layouts[layout], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center"
          style={{ width: '300px', height: '250px', maxWidth: '100%' }}
        >
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">— MultiTag Ad {i + 1} —</p>
            <div id={`multitag-slot-${i}`} />
          </div>
        </div>
      ))}
    </div>
  )
}
