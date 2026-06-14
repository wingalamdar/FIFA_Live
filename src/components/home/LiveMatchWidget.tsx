"use client";

import { motion } from "framer-motion";
import { getFlagEmoji, cn } from "@/lib/utils";
import type { Match, MatchEvent } from "@/types";

function EventIcon({ event }: { event: MatchEvent }) {
  if (event.type === "goal" || event.type === "penalty" || event.type === "own_goal") {
    return <span className="text-yellow-400 text-xs font-bold">⚽</span>;
  }
  if (event.type === "yellow_card") {
    return <span className="text-yellow-400 text-xs">🟨</span>;
  }
  if (event.type === "red_card") {
    return <span className="text-red-500 text-xs">🟥</span>;
  }
  if (event.type === "substitution") {
    return <span className="text-blue-400 text-xs">🔄</span>;
  }
  return null;
}

export default function LiveMatchWidget({ match }: { match: Match }) {
  const homeFlag = getFlagEmoji(match.homeTeam.code);
  const awayFlag = getFlagEmoji(match.awayTeam.code);

  const homePossession = match.possession?.home ?? 50;
  const awayPossession = match.possession?.away ?? 50;
  const homeShots = match.shotsOnTarget?.home ?? 0;
  const awayShots = match.shotsOnTarget?.away ?? 0;

  const homeEvents = match.events?.filter((e) => e.team === "home") ?? [];
  const awayEvents = match.events?.filter((e) => e.team === "away") ?? [];

  return (
    <motion.div
      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-red-400 font-bold text-sm tracking-widest">LIVE</span>
        </div>
        <span className="text-zinc-500 text-sm font-mono">
          {match.minute ? `${match.minute}'` : "0'"}
        </span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-3xl">{homeFlag}</span>
          <span className="text-white font-semibold text-sm sm:text-base truncate max-w-[100px]">
            {match.homeTeam.shortName}
          </span>
        </div>
        <div className="flex items-center gap-3 px-4">
          <motion.span
            key={match.homeScore}
            className="text-4xl sm:text-5xl font-black text-white tabular-nums"
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {match.homeScore ?? 0}
          </motion.span>
          <span className="text-zinc-600 text-2xl font-bold">:</span>
          <motion.span
            key={match.awayScore}
            className="text-4xl sm:text-5xl font-black text-white tabular-nums"
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {match.awayScore ?? 0}
          </motion.span>
        </div>
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className="text-white font-semibold text-sm sm:text-base truncate max-w-[100px]">
            {match.awayTeam.shortName}
          </span>
          <span className="text-3xl">{awayFlag}</span>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
          <span>Possession</span>
          <span>{homePossession}% - {awayPossession}%</span>
        </div>
        <div className="flex h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="bg-emerald-400 rounded-l-full"
            initial={{ width: 0 }}
            animate={{ width: `${homePossession}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <motion.div
            className="bg-cyan-400 rounded-r-full"
            initial={{ width: 0 }}
            animate={{ width: `${awayPossession}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs text-zinc-500 mb-4">
        <span>Shots on target: {homeShots}</span>
        <span>Shots on target: {awayShots}</span>
      </div>

      {(homeEvents.length > 0 || awayEvents.length > 0) && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
          <div className="space-y-1.5">
            {homeEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-2 text-xs text-zinc-400">
                <EventIcon event={event} />
                <span>{event.player}</span>
                <span className="text-zinc-600 ml-auto">{event.minute}&apos;</span>
              </div>
            ))}
          </div>
          <div className="space-y-1.5 text-right">
            {awayEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-2 text-xs text-zinc-400 justify-end">
                <span className="text-zinc-600">{event.minute}&apos;</span>
                <span>{event.player}</span>
                <EventIcon event={event} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white/5 text-center">
        <span className="text-zinc-600 text-xs">{match.stage} &middot; {match.venue}</span>
      </div>
    </motion.div>
  );
}
