"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MatchStatsProps {
  stats: Record<string, { home: number; away: number }>;
}

const statLabels: Record<string, string> = {
  possession: "Possession",
  shots: "Total Shots",
  shotsOnTarget: "Shots on Target",
  corners: "Corners",
  fouls: "Fouls",
  offsides: "Offsides",
  yellowCards: "Yellow Cards",
  redCards: "Red Cards",
  saves: "Saves",
};

export default function MatchStats({ stats }: MatchStatsProps) {
  const entries = Object.entries(stats).filter(([key]) => key in statLabels);

  if (!entries.length) {
    return (
      <div className="text-center py-8 text-zinc-500 text-sm">No stats available</div>
    );
  }

  const getMaxValue = (home: number, away: number) => {
    const max = Math.max(home, away);
    return max || 1;
  };

  return (
    <div className="space-y-4">
      {entries.map(([key, { home, away }], i) => {
        const max = getMaxValue(home, away);
        const homePercent = (home / max) * 100;
        const awayPercent = (away / max) * 100;
        const isPossession = key === "possession";

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={cn(
                "text-sm font-medium tabular-nums",
                home > away ? "text-emerald-400" : "text-zinc-500"
              )}>
                {isPossession ? `${home}%` : home}
              </span>
              <span className="text-xs text-zinc-600 uppercase tracking-wider font-medium">
                {statLabels[key]}
              </span>
              <span className={cn(
                "text-sm font-medium tabular-nums",
                away > home ? "text-cyan-400" : "text-zinc-500"
              )}>
                {isPossession ? `${away}%` : away}
              </span>
            </div>
            <div className="flex h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="bg-emerald-400 rounded-l-full"
                initial={{ width: 0 }}
                animate={{ width: `${homePercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 + i * 0.05 }}
              />
              <motion.div
                className="bg-cyan-400 rounded-r-full"
                initial={{ width: 0 }}
                animate={{ width: `${awayPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 + i * 0.05 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
