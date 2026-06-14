"use client";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ThumbsUp, BarChart3 } from "lucide-react";
import { getPredictions, getMatches } from "@/lib/api";
import { getFlagEmoji, cn } from "@/lib/utils";
import type { Prediction, Match } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MonetagAdBanner } from "@/components/ads/MonetagAdBanner";

function ProbabilityBar({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-500">{label}</span>
        <span className="font-bold text-zinc-300 tabular-nums">{value}%</span>
      </div>
      <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", color)}
          initial={{ width: 0 }} animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function PredictionCard({ prediction, match, index }: { prediction: Prediction; match: Match; index: number }) {
  const [fanVoted, setFanVoted] = useState<"home" | "away" | "draw" | null>(null);
  const [localVotes, setLocalVotes] = useState(prediction.fanVotes);

  const handleFanVote = (vote: "home" | "away" | "draw") => {
    setFanVoted(vote);
    setLocalVotes(prev => ({
      ...prev,
      [vote]: prev[vote] + 1,
    }));
  };

  const totalVotes = localVotes.home + localVotes.away + localVotes.draw;

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.4 }}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-3xl">{getFlagEmoji(match.homeTeam.code)}</span>
              <div>
                <span className="text-white font-semibold block truncate">{match.homeTeam.name}</span>
                <span className="text-xs text-zinc-500">FIFA #{match.homeTeam.rank}</span>
              </div>
            </div>
            <div className="text-center shrink-0">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {prediction.predictedScore.home} - {prediction.predictedScore.away}
              </div>
              <Badge variant="goal" className="mt-1">Predicted Score</Badge>
            </div>
            <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
              <div className="text-right">
                <span className="text-white font-semibold block truncate">{match.awayTeam.name}</span>
                <span className="text-xs text-zinc-500">FIFA #{match.awayTeam.rank}</span>
              </div>
              <span className="text-3xl">{getFlagEmoji(match.awayTeam.code)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Win Probability</h4>
              <ProbabilityBar value={prediction.homeWinProb} color="bg-emerald-400" label={`${match.homeTeam.shortName} Win`} />
              <ProbabilityBar value={prediction.drawProb} color="bg-zinc-500" label="Draw" />
              <ProbabilityBar value={prediction.awayWinProb} color="bg-cyan-400" label={`${match.awayTeam.shortName} Win`} />
            </div>

            <div>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Head-to-Head</h4>
              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                <div className="text-center flex-1">
                  <div className="text-2xl font-black text-emerald-400">{prediction.headToHead.home}</div>
                  <div className="text-xs text-zinc-500">{match.homeTeam.shortName}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-zinc-500">{prediction.headToHead.draws}</div>
                  <div className="text-[10px] text-zinc-600">Draws</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-2xl font-black text-cyan-400">{prediction.headToHead.away}</div>
                  <div className="text-xs text-zinc-500">{match.awayTeam.shortName}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Key Players</h4>
              <div className="space-y-1.5">
                {prediction.keyPlayers.home.map(name => (
                  <div key={name} className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {name}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">&nbsp;</h4>
              <div className="space-y-1.5">
                {prediction.keyPlayers.away.map(name => (
                  <div key={name} className="flex items-center gap-2 text-xs text-zinc-400 justify-end">
                    {name}
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <ThumbsUp className="w-3 h-3" /> Fan Vote
              </h4>
              <span className="text-xs text-zinc-600">{totalVotes} votes</span>
            </div>
            <div className="flex h-2 rounded-full bg-white/5 overflow-hidden mb-3">
              <motion.div className="bg-emerald-400" initial={{ width: 0 }} animate={{ width: `${(localVotes.home / totalVotes) * 100}%` }} transition={{ duration: 0.8 }} />
              <motion.div className="bg-zinc-500" initial={{ width: 0 }} animate={{ width: `${(localVotes.draw / totalVotes) * 100}%` }} transition={{ duration: 0.8 }} />
              <motion.div className="bg-cyan-400" initial={{ width: 0 }} animate={{ width: `${(localVotes.away / totalVotes) * 100}%` }} transition={{ duration: 0.8 }} />
            </div>
            <div className="flex gap-2">
              <Button
                variant={fanVoted === "home" ? "default" : "outline"} size="sm"
                onClick={() => handleFanVote("home")} className="flex-1 text-xs"
              >
                {match.homeTeam.shortName}
              </Button>
              <Button
                variant={fanVoted === "draw" ? "default" : "outline"} size="sm"
                onClick={() => handleFanVote("draw")} className="flex-1 text-xs"
              >
                Draw
              </Button>
              <Button
                variant={fanVoted === "away" ? "default" : "outline"} size="sm"
                onClick={() => handleFanVote("away")} className="flex-1 text-xs"
              >
                {match.awayTeam.shortName}
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <BarChart3 className="w-3 h-3" /> AI Analysis
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Based on current form, historical data, and squad depth, {match.homeTeam.shortName} has a {prediction.homeWinProb}% chance of winning. 
              {match.homeTeam.rank < match.awayTeam.rank ? " Their higher FIFA ranking and recent performances suggest they are favorites." : " Despite the lower ranking, recent performances show promising signs."}
              Key battle: {prediction.keyPlayers.home[0]} vs {prediction.keyPlayers.away[0]} in midfield.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function PredictionsPage() {
  const [predictionsWithMatch, setPredictionsWithMatch] = useState<(Prediction & { match: Match })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPredictions(), getMatches()])
      .then(([preds, mmatches]) => {
        const merged = preds
          .map(p => ({ ...p, match: mmatches.find(m => m.id === p.matchId) }))
          .filter((p): p is Prediction & { match: Match } => !!p.match);
        setPredictionsWithMatch(merged);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl sm:text-4xl font-black text-white">AI Match Predictions</h1>
          <Badge variant="default" className="text-xs px-3 py-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI
          </Badge>
        </div>
        <p className="text-zinc-400 text-sm mb-10">Data-driven predictions powered by advanced analytics</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {predictionsWithMatch.map((item, i) => (
            <PredictionCard key={item.id} prediction={item} match={item.match} index={i} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <MonetagAdBanner width={728} height={90} position="bottom" />
        </div>
      </div>
    </div>
  );
}
