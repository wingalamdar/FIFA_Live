"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MatchEvent } from "@/types";

interface MatchTimelineProps {
  events: MatchEvent[];
  homeTeam: string;
  awayTeam: string;
}

const eventConfig = {
  goal: { dotColor: "bg-emerald-400 border-emerald-400", icon: "⚽", label: "Goal" },
  penalty: { dotColor: "bg-emerald-400 border-emerald-400", icon: "⚽", label: "Penalty" },
  own_goal: { dotColor: "bg-red-400 border-red-400", icon: "⚽", label: "Own Goal" },
  yellow_card: { dotColor: "bg-yellow-400 border-yellow-400", icon: "🟨", label: "Yellow Card" },
  red_card: { dotColor: "bg-red-500 border-red-500", icon: "🟥", label: "Red Card" },
  substitution: { dotColor: "bg-blue-400 border-blue-400", icon: "🔄", label: "Substitution" },
};

export default function MatchTimeline({ events, homeTeam, awayTeam }: MatchTimelineProps) {
  if (!events.length) {
    return (
      <div className="text-center py-8 text-zinc-500 text-sm">No events recorded</div>
    );
  }

  const sorted = [...events].sort((a, b) => a.minute - b.minute);

  return (
    <div className="relative">
      <div className="absolute left-[17px] top-3 bottom-3 w-[2px] bg-white/5" />

      <div className="space-y-0">
        {sorted.map((event, i) => {
          const config = eventConfig[event.type];
          const isHome = event.team === "home";

          return (
            <motion.div
              key={event.id}
              className={cn(
                "flex items-start gap-4 py-2.5",
                isHome ? "flex-row" : "flex-row-reverse"
              )}
              initial={{ opacity: 0, x: isHome ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
            >
              <div className={cn("flex-1", isHome ? "text-right" : "text-left")}>
                <p className="text-white text-sm font-medium">{event.player}</p>
                {event.assist && (
                  <p className="text-zinc-500 text-xs">Assist: {event.assist}</p>
                )}
                <p className="text-zinc-600 text-xs mt-0.5">
                  {config.label}
                  {event.type === "substitution" && " (Out)"}
                </p>
              </div>

              <div className="flex flex-col items-center shrink-0">
                <div className={cn(
                  "w-[34px] h-[34px] rounded-full border-2 flex items-center justify-center text-xs relative z-10 bg-black/60 backdrop-blur",
                  config.dotColor
                )}>
                  {config.icon}
                </div>
              </div>

              <div className={cn("flex-1", isHome ? "text-left" : "text-right")}>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 text-xs font-mono font-bold">
                  {event.minute}&apos;
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
