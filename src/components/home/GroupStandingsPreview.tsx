"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getStandings } from "@/lib/api";
import { getFlagEmoji, cn } from "@/lib/utils";
import type { GroupStanding } from "@/types";

export default function GroupStandingsPreview() {
  const [groups, setGroups] = useState<GroupStanding[]>([]);

  useEffect(() => {
    getStandings().then(setGroups);
  }, []);

  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Group Standings</h2>
            <p className="text-zinc-400 mt-1 text-sm">Current rankings across all groups</p>
          </div>
          <Link href="/standings" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium">View All Groups &rarr;</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {groups.slice(0, 8).map((group, gi) => (
            <motion.div
              key={group.group} initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.05, duration: 0.4 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-white/5">
                <h3 className="text-sm font-bold text-white">Group {group.group}</h3>
              </div>
              <div className="divide-y divide-white/5">
                {group.teams.map((team, i) => (
                  <div key={team.id} className={cn("flex items-center gap-2 px-4 py-2.5 text-xs", i < 2 ? "bg-emerald-400/5" : "bg-red-400/5")}>
                    <span className={cn("w-5 h-5 rounded flex items-center justify-center font-bold", i < 2 ? "bg-emerald-400/20 text-emerald-400" : "bg-red-400/20 text-red-400")}>{i + 1}</span>
                    <span className="text-base">{getFlagEmoji(team.code)}</span>
                    <span className="flex-1 text-white font-medium truncate">{team.name}</span>
                    <span className="text-zinc-500 font-mono tabular-nums w-6 text-center">{team.points}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-white/5 text-center text-[10px] text-zinc-600">Pts</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
