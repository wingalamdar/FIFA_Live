"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn, getFlagEmoji, formatTime, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { GlowingDot } from "@/components/ui/GlowingDot";
import type { Match } from "@/types";

interface MatchCardProps {
  match: Match;
  expanded?: boolean;
}

export default function MatchCard({ match, expanded = false }: MatchCardProps) {
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";
  const isScheduled = match.status === "scheduled";
  const homeFlag = getFlagEmoji(match.homeTeam.code);
  const awayFlag = getFlagEmoji(match.awayTeam.code);
  const homePossession = match.possession?.home;
  const awayPossession = match.possession?.away;

  const scoreDisplay = () => {
    if (isLive || isFinished) {
      return (
        <div className="flex items-center gap-3 px-4">
          <motion.span
            key={`${match.id}-h`}
            className="text-4xl sm:text-5xl font-black text-white tabular-nums"
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {match.homeScore ?? 0}
          </motion.span>
          <span className="text-zinc-600 text-2xl font-bold">:</span>
          <motion.span
            key={`${match.id}-a`}
            className="text-4xl sm:text-5xl font-black text-white tabular-nums"
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {match.awayScore ?? 0}
          </motion.span>
        </div>
      );
    }
    return (
      <div className="px-4">
        <span className="text-lg font-black text-zinc-500">vs</span>
      </div>
    );
  };

  const statusBadge = () => {
    if (isLive) {
      return (
        <div className="flex items-center gap-2">
          <GlowingDot color="red" />
          <Badge variant="live" className="tracking-widest">LIVE</Badge>
        </div>
      );
    }
    if (isFinished) {
      return <Badge variant="default">FT</Badge>;
    }
    return <span className="text-zinc-500 text-sm font-mono">{formatTime(match.date)}</span>;
  };

  return (
    <motion.div
      className={cn(
        "bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5",
        "hover:bg-white/10 hover:border-emerald-400/20 transition-all",
        "cursor-pointer relative overflow-hidden"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {statusBadge()}
          {isLive && match.minute && (
            <motion.span
              className="text-red-400 text-sm font-mono"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {match.minute}&apos;
            </motion.span>
          )}
        </div>
        <span className="text-zinc-600 text-xs">{match.stage}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-3xl">{homeFlag}</span>
          <span className="text-white font-semibold text-sm sm:text-base truncate max-w-[100px]">
            {match.homeTeam.shortName}
          </span>
        </div>
        {scoreDisplay()}
        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
          <span className="text-white font-semibold text-sm sm:text-base truncate max-w-[100px]">
            {match.awayTeam.shortName}
          </span>
          <span className="text-3xl">{awayFlag}</span>
        </div>
      </div>

      {homePossession !== undefined && awayPossession !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
            <span>{match.homeTeam.shortName} {homePossession}%</span>
            <span>{awayPossession}% {match.awayTeam.shortName}</span>
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
      )}

      {isScheduled && (
        <div className="text-center mt-2">
          <span className="text-zinc-600 text-xs">{formatDate(match.date)} &middot; {match.venue}</span>
        </div>
      )}

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="mt-4 pt-4 border-t border-white/5"
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-zinc-500 text-xs mb-1">Venue</p>
              <p className="text-white">{match.venue}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-xs mb-1">Date</p>
              <p className="text-white">{formatDate(match.date)}</p>
            </div>
          </div>
          {match.group !== "KO" && (
            <div className="mt-2">
              <span className="text-zinc-500 text-xs">Group: </span>
              <span className="text-white text-sm">{match.group}</span>
            </div>
          )}
        </motion.div>
      )}

      <div className="absolute bottom-2 right-3">
        <ChevronDown className={cn(
          "w-4 h-4 text-zinc-600 transition-transform",
          expanded && "rotate-180"
        )} />
      </div>
    </motion.div>
  );
}
