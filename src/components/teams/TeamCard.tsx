"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn, getFlagEmoji } from "@/lib/utils";
import type { Team } from "@/types";

interface TeamCardProps {
  team: Team;
}

const formColors: Record<string, string> = {
  W: "bg-emerald-400",
  D: "bg-zinc-500",
  L: "bg-red-400",
};

export default function TeamCard({ team }: TeamCardProps) {
  const gradientFrom = `hsla(${(team.id.charCodeAt(0) * 37) % 360}, 70%, 40%, 0.3)`;
  const gradientTo = `hsla(${(team.id.charCodeAt(team.id.length - 1) * 53) % 360}, 70%, 30%, 0.3)`;

  return (
    <Link href={`/teams/${team.id}`}>
      <motion.div
        className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5 hover:bg-white/10 hover:border-emerald-400/30 transition-all h-full flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{
              background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            }}
          >
            {team.code}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{getFlagEmoji(team.code)}</span>
              <h3 className="text-white font-semibold text-base truncate group-hover:text-emerald-400 transition-colors">
                {team.name}
              </h3>
            </div>
            <p className="text-zinc-500 text-xs mt-0.5">Group {team.group}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500 mb-3 mt-auto">
          <span>FIFA Rank #{team.rank}</span>
          <span>{team.points} pts</span>
        </div>

        <div className="flex items-center gap-1.5">
          {team.form.map((result, i) => (
            <span
              key={i}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-black",
                formColors[result]
              )}
            >
              {result}
            </span>
          ))}
        </div>
      </motion.div>
    </Link>
  );
}
