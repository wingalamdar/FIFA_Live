"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTopScorers } from "@/lib/api";
import { getFlagEmoji, cn } from "@/lib/utils";
import type { Player } from "@/types";

const medals = [
  <span key="gold" className="text-yellow-400">&#9733;</span>,
  <span key="silver" className="text-zinc-300">&#9733;</span>,
  <span key="bronze" className="text-amber-600">&#9733;</span>,
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold text-xs shadow-lg shadow-yellow-400/20">1</div>;
  }
  if (rank === 2) {
    return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 flex items-center justify-center text-black font-bold text-xs shadow-lg shadow-zinc-400/20">2</div>;
  }
  if (rank === 3) {
    return <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-amber-600/20">3</div>;
  }
  return <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 font-bold text-xs">{rank}</div>;
}

export default function TopScorers() {
  const [scorers, setScorers] = useState<Player[]>([]);

  useEffect(() => {
    getTopScorers().then(setScorers);
  }, []);

  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Top Scorers</h2>
          <p className="text-zinc-400 mt-1 text-sm">Golden Boot race leaders</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          {scorers.slice(0, 10).map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className={cn(
                "flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors",
                i === 0 && "bg-gradient-to-r from-yellow-400/5 to-transparent",
                i === 1 && "bg-gradient-to-r from-zinc-300/5 to-transparent",
                i === 2 && "bg-gradient-to-r from-amber-600/5 to-transparent"
              )}
            >
              <RankBadge rank={i + 1} />
              <div className="flex-1 flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {player.name.split(" ").pop()?.charAt(0) ?? "?"}
                </div>
                <div className="min-w-0">
                  <p className={cn(
                    "font-semibold truncate",
                    i === 0 ? "text-yellow-400" : i === 1 ? "text-zinc-300" : i === 2 ? "text-amber-600" : "text-white"
                  )}>
                    {player.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <span>{getFlagEmoji(player.nationality.slice(0, 2).toUpperCase())}</span>
                    <span>{player.teamName}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className={cn(
                    "text-xl font-black tabular-nums",
                    i === 0 ? "text-yellow-400" : i === 1 ? "text-zinc-300" : i === 2 ? "text-amber-600" : "text-white"
                  )}>
                    {player.goals}
                  </p>
                  <p className="text-zinc-600 text-xs">Goals</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-cyan-400 tabular-nums">{player.assists}</p>
                  <p className="text-zinc-600 text-xs">Assists</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
