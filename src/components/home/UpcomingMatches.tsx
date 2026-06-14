"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getUpcomingMatches } from "@/lib/api";
import { formatDate, formatTime, getFlagEmoji } from "@/lib/utils";
import type { Match } from "@/types";

export default function UpcomingMatches() {
  const [upcoming, setUpcoming] = useState<Match[]>([]);

  useEffect(() => {
    getUpcomingMatches().then(setUpcoming);
  }, []);

  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Upcoming Matches</h2>
            <p className="text-zinc-400 mt-1 text-sm">Don&apos;t miss the action</p>
          </div>
          <Link href="/schedule" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium">Full Schedule &rarr;</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcoming.slice(0, 6).map((match, i) => (
            <motion.div
              key={match.id} initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.4 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-zinc-500">{formatDate(match.date)}</span>
                <span className="text-xs font-mono text-zinc-600">{formatTime(match.time)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xl">{getFlagEmoji(match.homeTeam.code)}</span>
                  <span className="text-white text-sm font-medium truncate">{match.homeTeam.shortName}</span>
                </div>
                <div className="text-center shrink-0">
                  <span className="text-lg font-black text-zinc-500">vs</span>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                  <span className="text-white text-sm font-medium truncate">{match.awayTeam.shortName}</span>
                  <span className="text-xl">{getFlagEmoji(match.awayTeam.code)}</span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="text-xs text-zinc-600">{match.venue}</span>
                {match.stage !== "Group Stage" && (
                  <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">{match.stage}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
