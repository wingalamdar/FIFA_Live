'use client';
import { cn } from "@/lib/utils"

interface AdBannerProps {
  className?: string;
  width?: number;
  height?: number;
  position?: 'top' | 'middle' | 'bottom' | 'sidebar';
}

export function MonetagAdBanner({ className, width = 300, height = 250, position = 'middle' }: AdBannerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className="relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center"
        style={{ width: `${width}px`, height: `${height}px`, maxWidth: '100%' }}
      >
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">— Advertisement —</p>
          <div className="w-full h-full flex items-center justify-center" id="monetag-ad-slot" />
        </div>
      </div>
    </div>
  )
}
