"use client";

import { motion } from "framer-motion";
import { cn, getFlagEmoji } from "@/lib/utils";
import type { Match } from "@/types";

interface KnockoutBracketProps {
  knockoutMatches: Match[];
}

interface BracketNode {
  match: Match;
  nextMatchId?: string;
  side?: "left" | "right";
}

function BracketMatch({ match, highlighted }: { match: Match; highlighted: boolean }) {
  const isFinished = match.status === "finished";
  const homeWin = isFinished && match.homeScore !== null && match.awayScore !== null && match.homeScore > match.awayScore;
  const awayWin = isFinished && match.homeScore !== null && match.awayScore !== null && match.awayScore > match.homeScore;

  return (
    <div className={cn(
      "bg-white/5 backdrop-blur rounded-lg border px-3 py-2 min-w-[180px] transition-all",
      highlighted ? "border-emerald-400/40 bg-emerald-400/5" : "border-white/10"
    )}>
      <div className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5 font-medium">{match.round}</div>
      <div className="space-y-1">
        <div className={cn(
          "flex items-center justify-between gap-2 text-sm",
          homeWin ? "text-emerald-400 font-semibold" : "text-zinc-300"
        )}>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm">{getFlagEmoji(match.homeTeam.code)}</span>
            <span className="truncate">{match.homeTeam.shortName}</span>
          </div>
          <span className="font-bold tabular-nums shrink-0">
            {isFinished ? match.homeScore : "-"}
          </span>
        </div>
        <div className={cn(
          "flex items-center justify-between gap-2 text-sm",
          awayWin ? "text-emerald-400 font-semibold" : "text-zinc-300"
        )}>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm">{getFlagEmoji(match.awayTeam.code)}</span>
            <span className="truncate">{match.awayTeam.shortName}</span>
          </div>
          <span className="font-bold tabular-nums shrink-0">
            {isFinished ? match.awayScore : "-"}
          </span>
        </div>
      </div>
    </div>
  );
}

function BracketRound({ title, matches, highlightedIds }: { title: string; matches: Match[]; highlightedIds: string[] }) {
  return (
    <div className="flex flex-col justify-around gap-4">
      <h3 className="text-xs text-zinc-600 uppercase tracking-widest font-semibold text-center mb-2">{title}</h3>
      {matches.map((match) => (
        <motion.div
          key={match.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <BracketMatch match={match} highlighted={highlightedIds.includes(match.id)} />
        </motion.div>
      ))}
    </div>
  );
}

export default function KnockoutBracket({ knockoutMatches }: KnockoutBracketProps) {
  const r16 = knockoutMatches.filter((m) => m.round === "Round of 16");
  const qf = knockoutMatches.filter((m) => m.round === "Quarter-final");
  const sf = knockoutMatches.filter((m) => m.round === "Semi-final");
  const third = knockoutMatches.filter((m) => m.round === "Third Place");
  const finalMatch = knockoutMatches.filter((m) => m.round === "Final");

  const allMatches = [...r16, ...qf, ...sf, ...third, ...finalMatch];
  const finishedIds = allMatches.filter((m) => m.status === "finished").map((m) => m.id);
  const winnerIds = allMatches.filter((m) => {
    if (m.status !== "finished" || m.homeScore === null || m.awayScore === null) return false;
    return m.homeScore !== m.awayScore;
  }).map((m) => m.id);

  if (!allMatches.length) {
    return (
      <div className="text-center py-8 text-zinc-500 text-sm">No knockout matches available</div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }}>
      <div className="flex items-stretch gap-6 min-w-[800px] px-2">
        {r16.length > 0 && (
          <BracketRound title="Round of 16" matches={r16} highlightedIds={winnerIds} />
        )}

        {r16.length > 0 && (
          <div className="flex items-center">
            <div className="w-6 h-[2px] bg-white/10" />
          </div>
        )}

        {qf.length > 0 && (
          <BracketRound title="Quarter-finals" matches={qf} highlightedIds={winnerIds} />
        )}

        {qf.length > 0 && (
          <div className="flex items-center">
            <div className="w-6 h-[2px] bg-white/10" />
          </div>
        )}

        {sf.length > 0 && (
          <BracketRound title="Semi-finals" matches={sf} highlightedIds={winnerIds} />
        )}

        <div className="flex flex-col justify-center gap-4">
          <div className="flex items-center">
            <div className="w-6 h-[2px] bg-white/10" />
          </div>

          {finalMatch.length > 0 && (
            <BracketRound title="Final" matches={finalMatch} highlightedIds={finishedIds} />
          )}

          {third.length > 0 && (
            <div className="mt-2">
              <BracketRound title="Third Place" matches={third} highlightedIds={finishedIds} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
