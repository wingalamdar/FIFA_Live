"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStandings } from "@/lib/api";
import { getFlagEmoji, cn } from "@/lib/utils";
import type { GroupStanding } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlowingDot } from "@/components/ui/GlowingDot";
import { MonetagAdBanner } from "@/components/ads/MonetagAdBanner";

function GroupTable({ group }: { group: GroupStanding }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Group {group.group}</span>
          <div className="flex items-center gap-1 text-[10px] text-zinc-600 font-normal">
            <span className="w-3 h-3 rounded bg-emerald-400/20 border border-emerald-400/30" />
            <span>Qualify</span>
            <span className="w-3 h-3 rounded bg-red-400/20 border border-red-400/30 ml-2" />
            <span>Eliminated</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs text-zinc-500">
                <th className="text-left px-4 py-2 w-8">#</th>
                <th className="text-left px-2 py-2">Team</th>
                <th className="text-center px-2 py-2 w-8">P</th>
                <th className="text-center px-2 py-2 w-8">W</th>
                <th className="text-center px-2 py-2 w-8">D</th>
                <th className="text-center px-2 py-2 w-8">L</th>
                <th className="text-center px-2 py-2 w-8">GF</th>
                <th className="text-center px-2 py-2 w-8">GA</th>
                <th className="text-center px-2 py-2 w-8">GD</th>
                <th className="text-center px-4 py-2 w-10">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {group.teams.map((team, i) => {
                const qualifies = i < 2;
                return (
                  <motion.tr
                    key={team.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn("hover:bg-white/5 transition-colors", qualifies ? "bg-emerald-400/[0.03]" : "bg-red-400/[0.03]")}
                  >
                    <td className="px-4 py-3">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold", qualifies ? "bg-emerald-400/20 text-emerald-400" : "bg-red-400/20 text-red-400")}>
                        {i + 1}
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getFlagEmoji(team.code)}</span>
                        <span className="font-semibold text-white truncate max-w-[120px]">{team.name}</span>
                      </div>
                    </td>
                    <td className="text-center px-2 py-3 text-white font-mono tabular-nums">{team.played}</td>
                    <td className="text-center px-2 py-3 text-white font-mono tabular-nums">{team.wins}</td>
                    <td className="text-center px-2 py-3 text-white font-mono tabular-nums">{team.draws}</td>
                    <td className="text-center px-2 py-3 text-white font-mono tabular-nums">{team.losses}</td>
                    <td className="text-center px-2 py-3 text-white font-mono tabular-nums">{team.goalsFor}</td>
                    <td className="text-center px-2 py-3 text-white font-mono tabular-nums">{team.goalsAgainst}</td>
                    <td className={cn("text-center px-2 py-3 font-mono tabular-nums", team.goalDiff > 0 ? "text-emerald-400" : team.goalDiff < 0 ? "text-red-400" : "text-white")}>
                      {team.goalDiff > 0 ? "+" : ""}{team.goalDiff}
                    </td>
                    <td className="text-center px-4 py-3">
                      <span className="text-lg font-black text-white tabular-nums">{team.points}</span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-white/5 space-y-2">
          {group.teams.map((team, i) => (
            <div key={team.id} className="flex items-center gap-2 text-xs">
              <span className="w-4 text-zinc-600">{i + 1}.</span>
              <div className="flex items-center gap-1.5 flex-1">
                <span className="text-xs">{getFlagEmoji(team.code)}</span>
                <span className="text-zinc-400 truncate">{team.shortName}</span>
              </div>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-[100px]">
                <motion.div
                  className={cn("h-full rounded-full", team.qualificationProbability > 50 ? "bg-emerald-400" : "bg-red-400")}
                  initial={{ width: 0 }} animate={{ width: `${team.qualificationProbability}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              </div>
              <span className="text-zinc-500 w-10 text-right tabular-nums">{team.qualificationProbability}%</span>
            </div>
          ))}
          <div className="text-[10px] text-zinc-600 text-right mt-1">Qualification Probability</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StandingsPage() {
  const [standings, setStandings] = useState<GroupStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStandings()
      .then(setStandings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sortedStandings = useMemo(() => [...standings].sort((a, b) => a.group.localeCompare(b.group)), [standings]);

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-white">Group Standings</h1>
          <GlowingDot color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedStandings.map((group, i) => (
            <motion.div key={group.group} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.4 }}>
              <GroupTable group={group} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <MonetagAdBanner width={728} height={90} position="bottom" />
        </div>
      </div>
    </div>
  );
}
