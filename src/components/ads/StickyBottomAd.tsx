'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StickyBottomAd() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-black/90 backdrop-blur-lg border-t border-white/10 md:hidden">
      <button
        onClick={() => setVisible(false)}
        className="absolute -top-6 right-2 bg-black/90 rounded-t-lg px-2 py-1 border-t border-l border-r border-white/10"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
      <div className="flex items-center justify-center p-2">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-600">— Ad —</p>
          <div id="sticky-bottom-ad" className="w-[320px] h-[50px]" />
        </div>
      </div>
    </div>
  )
}
