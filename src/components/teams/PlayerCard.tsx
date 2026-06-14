"use client";

import { motion } from "framer-motion";
import { cn, getFlagEmoji } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Player } from "@/types";

interface PlayerCardProps {
  player: Player;
  compact?: boolean;
}

const positionColors: Record<string, string> = {
  GK: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
  DEF: "bg-blue-400/20 text-blue-400 border-blue-400/30",
  MID: "bg-emerald-400/20 text-emerald-400 border-emerald-400/30",
  FWD: "bg-red-400/20 text-red-400 border-red-400/30",
};

export default function PlayerCard({ player, compact = false }: PlayerCardProps) {
  const initials = player.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      className={cn(
        "bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 hover:border-emerald-400/20 transition-all",
        compact ? "p-3" : "p-4"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className={cn("flex items-center gap-3", compact && "gap-2")}>
        <div
          className={cn(
            "rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center text-white font-bold shrink-0 border border-white/10",
            compact ? "w-10 h-10 text-xs" : "w-12 h-12 text-sm"
          )}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={cn("text-white font-semibold truncate", compact ? "text-sm" : "text-base")}>
              {player.name}
            </h4>
            {player.nationality && (
              <span className="shrink-0 text-sm">{getFlagEmoji(player.nationality.slice(0, 2).toUpperCase())}</span>
            )}
          </div>

          <div className={cn("flex items-center gap-2 mt-1", compact && "mt-0.5")}>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
              #{player.number}
            </Badge>
            <span className={cn(
              "text-[10px] font-medium px-1.5 py-0.5 rounded-full border",
              positionColors[player.position]
            )}>
              {player.position}
            </span>
            {!compact && (
              <span className="text-zinc-600 text-xs">{player.age} yrs</span>
            )}
          </div>
        </div>

        {!compact && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center">
              <p className="text-emerald-400 font-bold text-lg tabular-nums">{player.goals}</p>
              <p className="text-zinc-600 text-[10px]">Goals</p>
            </div>
            <div className="text-center">
              <p className="text-cyan-400 font-bold text-lg tabular-nums">{player.assists}</p>
              <p className="text-zinc-600 text-[10px]">Assists</p>
            </div>
          </div>
        )}
      </div>

      {compact && (player.goals > 0 || player.assists > 0) && (
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/5">
          <span className="text-xs text-emerald-400">{player.goals}G</span>
          <span className="text-xs text-cyan-400">{player.assists}A</span>
        </div>
      )}
    </motion.div>
  );
}
