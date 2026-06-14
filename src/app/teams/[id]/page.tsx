"use client";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getTeamById, getMatchesByTeam, getPlayers } from "@/lib/api";
import { getFlagEmoji, formatDate, formatTime, cn } from "@/lib/utils";
import type { Team, Match, Player } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MonetagAdBanner } from "@/components/ads/MonetagAdBanner";
import { MapPin, Calendar, Trophy, Users, Target } from "lucide-react";

function FormIndicator({ form }: { form: ("W" | "D" | "L")[] }) {
  return (
    <div className="flex gap-1">
      {form.map((result, i) => (
        <span
          key={i}
          className={cn(
            "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold",
            result === "W" ? "bg-emerald-400/20 text-emerald-400" : result === "D" ? "bg-zinc-500/20 text-zinc-400" : "bg-red-400/20 text-red-400"
          )}
        >
          {result}
        </span>
      ))}
    </div>
  );
}

function MatchRow({ match, teamId }: { match: Match; teamId: string }) {
  return (
    <div className="flex items-center gap-3 py-3 px-4 hover:bg-white/5 transition-colors rounded-lg">
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-lg">{getFlagEmoji(match.homeTeam.code)}</span>
        <span className={cn("text-sm truncate", match.homeTeam.id === teamId ? "text-white font-semibold" : "text-zinc-400")}>
          {match.homeTeam.shortName}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={match.status === "live" ? "live" : match.status === "finished" ? "default" : "outline"}>
          {match.status === "live" ? `${match.minute || 0}'` : match.status === "finished" ? `${match.homeScore} - ${match.awayScore}` : match.status === "scheduled" ? formatTime(match.time) : "PPD"}
        </Badge>
      </div>
      <div className="flex-1 flex items-center gap-2 min-w-0 justify-end">
        <span className={cn("text-sm truncate", match.awayTeam.id === teamId ? "text-white font-semibold" : "text-zinc-400")}>
          {match.awayTeam.shortName}
        </span>
        <span className="text-lg">{getFlagEmoji(match.awayTeam.code)}</span>
      </div>
    </div>
  );
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <Link href={`/players/${player.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {player.name.split(" ").pop()?.charAt(0) ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-semibold text-sm truncate">{player.name}</p>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span>{player.position}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span>#{player.number}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-black text-emerald-400 tabular-nums">{player.goals}</p>
            <p className="text-[10px] text-zinc-600">Goals</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function TeamPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"squad" | "matches" | "stats">("squad");
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<Team | undefined>(undefined);
  const [teamMatches, setTeamMatches] = useState<Match[]>([]);
  const [teamSquad, setTeamSquad] = useState<Player[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([getTeamById(id), getMatchesByTeam(id), getPlayers()])
      .then(([t, m, p]) => {
        setTeam(t);
        setTeamMatches(m);
        setTeamSquad(p.filter(pl => pl.teamId === id));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const topScorers = useMemo(() => [...teamSquad].sort((a, b) => b.goals - a.goals).slice(0, 5), [teamSquad]);

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">🏴</div>
          <h2 className="text-2xl font-bold text-zinc-400">Team not found</h2>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const wins = teamMatches.filter(m => {
    if (m.status !== "finished" || m.homeScore === null || m.awayScore === null) return false;
    return (m.homeTeam.id === id && m.homeScore > m.awayScore) || (m.awayTeam.id === id && m.awayScore > m.homeScore);
  }).length;

  const draws = teamMatches.filter(m => {
    if (m.status !== "finished" || m.homeScore === null || m.awayScore === null) return false;
    return m.homeScore === m.awayScore;
  }).length;

  const losses = teamMatches.filter(m => {
    if (m.status !== "finished" || m.homeScore === null || m.awayScore === null) return false;
    return (m.homeTeam.id === id && m.homeScore < m.awayScore) || (m.awayTeam.id === id && m.awayScore < m.homeScore);
  }).length;

  const goalsFor = teamMatches.reduce((acc, m) => {
    if (m.homeScore === null) return acc;
    return acc + (m.homeTeam.id === id ? m.homeScore : m.awayScore ?? 0);
  }, 0);

  const goalsAgainst = teamMatches.reduce((acc, m) => {
    if (m.awayScore === null) return acc;
    return acc + (m.homeTeam.id === id ? m.awayScore : m.homeScore ?? 0);
  }, 0);

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500/20 via-black to-cyan-500/20 border border-white/10 p-8 mb-8">
          <div className="absolute top-0 right-0 text-[200px] opacity-5 leading-none select-none pointer-events-none">
            {getFlagEmoji(team.code)}
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="text-7xl">{getFlagEmoji(team.code)}</div>
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-black text-white">{team.name}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                <Badge variant="outline">Group {team.group}</Badge>
                <Badge variant="goal">FIFA Rank #{team.rank}</Badge>
                {team.form.length > 0 && (
                  <Badge variant={team.form[team.form.length - 1] === "W" ? "default" : team.form[team.form.length - 1] === "D" ? "outline" : "destructive"}>
                    {team.form[team.form.length - 1]}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-3 text-sm text-zinc-400">
                <Users className="w-4 h-4" />
                <span>Coach: {team.coach}</span>
              </div>
            </div>
            <div className="sm:ml-auto">
              <FormIndicator form={team.form} />
            </div>
          </div>
        </div>

        <div className="flex gap-1 bg-white/5 rounded-lg p-1 border border-white/10 mb-8 w-fit">
          {(["squad", "matches", "stats"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn("px-4 py-2 text-sm rounded-md capitalize transition-all", activeTab === tab ? "bg-emerald-500 text-black font-medium" : "text-zinc-400 hover:text-white")}
            >
              {tab === "squad" ? "Squad" : tab === "matches" ? "Fixtures & Results" : "Statistics"}
            </button>
          ))}
        </div>

        {activeTab === "squad" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {teamSquad.map((player, i) => (
              <motion.div key={player.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.3 }}>
                <PlayerCard player={player} />
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "matches" && (
          <div className="space-y-2">
            {teamMatches.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">No matches yet</div>
            ) : (
              [...teamMatches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(match => (
                <MatchRow key={match.id} match={match} teamId={id} />
              ))
            )}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Matches Played", value: teamMatches.filter(m => m.status === "finished").length, icon: Calendar },
                { label: "Wins", value: wins, icon: Trophy },
                { label: "Goals For", value: goalsFor, icon: Target },
                { label: "Goals Against", value: goalsAgainst, icon: Target },
              ].map(stat => (
                <Card key={stat.label}>
                  <CardContent className="p-5 text-center">
                    <stat.icon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                    <p className="text-xs text-zinc-500">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader><CardTitle>Top Scorers</CardTitle></CardHeader>
              <CardContent className="p-0">
                {topScorers.length === 0 ? (
                  <div className="p-5 text-center text-zinc-500 text-sm">No goals scored yet</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {topScorers.map((player, i) => (
                      <div key={player.id} className="flex items-center gap-3 px-5 py-3">
                        <span className="text-xs font-bold text-zinc-600 w-5">{i + 1}</span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center text-xs font-bold text-white">
                          {player.name.split(" ").pop()?.charAt(0) ?? "?"}
                        </div>
                        <span className="flex-1 text-white text-sm font-medium">{player.name}</span>
                        <span className="text-lg font-black text-emerald-400 tabular-nums">{player.goals}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Recent Form</CardTitle></CardHeader>
              <CardContent className="p-5">
                <FormIndicator form={team.form} />
                <p className="text-xs text-zinc-500 mt-2">Last {team.form.length} matches</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <MonetagAdBanner width={728} height={90} position="bottom" />
        </div>
      </div>
    </div>
  );
}
