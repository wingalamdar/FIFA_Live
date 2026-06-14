'use client';

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlowingDot } from "@/components/ui/GlowingDot";

interface MatchScore {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeFlag: string;
  awayFlag: string;
  minute: number;
}

const mockScores: MatchScore[] = [
  { id: "1", homeTeam: "Brazil", awayTeam: "Argentina", homeScore: 2, awayScore: 1, homeFlag: "🇧🇷", awayFlag: "🇦🇷", minute: 78 },
  { id: "2", homeTeam: "Germany", awayTeam: "France", homeScore: 1, awayScore: 1, homeFlag: "🇩🇪", awayFlag: "🇫🇷", minute: 63 },
  { id: "3", homeTeam: "England", awayTeam: "Spain", homeScore: 3, awayScore: 0, homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", awayFlag: "🇪🇸", minute: 85 },
  { id: "4", homeTeam: "Portugal", awayTeam: "Netherlands", homeScore: 0, awayScore: 0, homeFlag: "🇵🇹", awayFlag: "🇳🇱", minute: 32 },
  { id: "5", homeTeam: "Italy", awayTeam: "Croatia", homeScore: 2, awayScore: 2, homeFlag: "🇮🇹", awayFlag: "🇭🇷", minute: 90 },
];

export function LiveScoreTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isPaused) return;

    let animationId: number;
    let startTime: number | null = null;
    const speed = 0.5;

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - (startTime as number);
      if (el) {
        el.scrollLeft += speed;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(step);
    }

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  const doubled = [...mockScores, ...mockScores];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:bottom-0 border-t border-white/10 bg-black/90 backdrop-blur-lg">
      <div className="flex items-center gap-3 px-4 py-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 shrink-0">
          <GlowingDot color="red" />
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">LIVE</span>
        </div>

        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex overflow-hidden gap-8 flex-1"
        >
          {doubled.map((match, i) => (
            <div
              key={`${match.id}-${i}`}
              className="flex items-center gap-3 shrink-0 hover:bg-white/5 rounded-lg px-3 py-1 transition-colors"
            >
              <span className="text-sm">{match.homeFlag}</span>
              <span className="text-sm text-white font-medium">{match.homeTeam}</span>
              <motion.span
                key={`${match.id}-${match.homeScore}-${i}`}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className={cn(
                  "text-sm font-bold tabular-nums",
                  match.homeScore > match.awayScore ? "text-emerald-400" : "text-white"
                )}
              >
                {match.homeScore}
              </motion.span>
              <span className="text-xs text-gray-600">:</span>
              <motion.span
                key={`${match.id}-${match.awayScore}-${i}`}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className={cn(
                  "text-sm font-bold tabular-nums",
                  match.awayScore > match.homeScore ? "text-emerald-400" : "text-white"
                )}
              >
                {match.awayScore}
              </motion.span>
              <span className="text-sm">{match.awayFlag}</span>
              <span className="text-xs text-gray-500">{match.minute}&apos;</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
