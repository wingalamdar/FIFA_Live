"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getPredictions, getMatchById } from "@/lib/api";
import { getFlagEmoji, cn } from "@/lib/utils";
import type { Prediction, Match } from "@/types";

function ProbabilityBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
      <span className="text-xs font-bold text-zinc-400 w-8 text-right tabular-nums">{value}%</span>
    </div>
  );
}

export default function MatchPredictions() {
  const [predictionsWithMatch, setPredictionsWithMatch] = useState<(Prediction & { match?: Match })[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const preds = await getPredictions();
      const withMatch = await Promise.all(
        preds.map(async (p) => {
          const match = await getMatchById(p.matchId);
          return { ...p, match };
        })
      );
      setPredictionsWithMatch(withMatch);
    };
    load();
  }, []);

  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Match Predictions</h2>
          <p className="text-zinc-400 mt-1 text-sm">AI-powered predictions & fan votes for upcoming matches</p>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {predictionsWithMatch.map((item, i) => {
              const match = item.match;
              if (!match) return null;

              return (
                <motion.div
                  key={item.id}
                  className="flex-shrink-0 w-[340px] sm:w-[380px] bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getFlagEmoji(match.homeTeam.code)}</span>
                      <span className="text-white font-semibold text-sm">{match.homeTeam.shortName}</span>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-emerald-400">
                        {item.predictedScore.home} - {item.predictedScore.away}
                      </div>
                      <span className="text-zinc-600 text-xs">Predicted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-sm">{match.awayTeam.shortName}</span>
                      <span className="text-2xl">{getFlagEmoji(match.awayTeam.code)}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-5">
                    <ProbabilityBar value={item.homeWinProb} color="bg-emerald-400" />
                    <ProbabilityBar value={item.drawProb} color="bg-zinc-500" />
                    <ProbabilityBar value={item.awayWinProb} color="bg-cyan-400" />
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                      <span>Fan Votes</span>
                    </div>
                    <div className="flex h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="bg-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.fanVotes.home}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                      <motion.div
                        className="bg-zinc-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.fanVotes.draw}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                      />
                      <motion.div
                        className="bg-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.fanVotes.away}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-zinc-600 mt-1">
                      <span>{item.fanVotes.home}%</span>
                      <span>{item.fanVotes.draw}%</span>
                      <span>{item.fanVotes.away}%</span>
                    </div>
                  </div>

                  {item.keyPlayers.home.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-zinc-600 block mb-1">Key Players (Home)</span>
                          {item.keyPlayers.home.map((name) => (
                            <div key={name} className="text-zinc-400 truncate">{name}</div>
                          ))}
                        </div>
                        <div className="text-right">
                          <span className="text-zinc-600 block mb-1">Key Players (Away)</span>
                          {item.keyPlayers.away.map((name) => (
                            <div key={name} className="text-zinc-400 truncate">{name}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
