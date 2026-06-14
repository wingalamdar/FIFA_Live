"use client";
import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPlayerById, getMatchesByTeam } from "@/lib/api";
import { getFlagEmoji, formatDate } from "@/lib/utils";
import type { Player, Match } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MonetagAdBanner } from "@/components/ads/MonetagAdBanner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Goal, Eye, Shield, Star, Award, ExternalLink, Globe, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const positionColors: Record<string, string> = {
  GK: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  DEF: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  MID: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  FWD: "bg-red-500/20 text-red-400 border-red-500/30",
};

const positionLabels: Record<string, string> = {
  GK: "Goalkeeper",
  DEF: "Defender",
  MID: "Midfielder",
  FWD: "Forward",
};

export default function PlayerPage() {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | undefined>(undefined);
  const [playerMatches, setPlayerMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPlayerById(id).then(p => {
      setPlayer(p);
      if (p) getMatchesByTeam(p.teamId).then(setPlayerMatches);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const chartData = useMemo(() => {
    if (!player) return [];
    return [
      { name: "Goals", value: player.goals, fill: "#34d399" },
      { name: "Assists", value: player.assists, fill: "#22d3ee" },
      { name: "Appearances", value: player.appearances, fill: "#a78bfa" },
      { name: "Yellow Cards", value: player.yellowCards, fill: "#fbbf24" },
      { name: "Red Cards", value: player.redCards, fill: "#f87171" },
    ];
  }, [player]);

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">👤</div>
          <h2 className="text-2xl font-bold text-zinc-400">Player not found</h2>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500/20 via-black to-cyan-500/20 border border-white/10 p-8 mb-8">
          <div className="absolute top-0 right-0 text-[200px] opacity-5 leading-none select-none pointer-events-none">
            {getFlagEmoji(player.nationality.slice(0, 2).toUpperCase())}
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-black text-3xl sm:text-4xl shadow-2xl shadow-emerald-500/30 shrink-0">
              {player.name.split(" ").pop()?.charAt(0) ?? "?"}
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-3xl sm:text-4xl font-black text-white">{player.name}</h1>
                {player.rating >= 9 && <Award className="w-6 h-6 text-yellow-400" />}
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <Badge className={positionColors[player.position] || ""}>{positionLabels[player.position] || player.position}</Badge>
                <Badge variant="outline">#{player.number}</Badge>
                <Badge variant="goal">{player.nationality}</Badge>
                <Link href={`/teams/${player.teamId}`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-white/20 transition-colors">
                    {getFlagEmoji(player.teamName.slice(0, 2).toUpperCase())} {player.teamName}
                  </Badge>
                </Link>
              </div>
              <p className="text-zinc-400 text-sm mt-2">Age: {player.age} &middot; Rating: {player.rating}/10</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {[
            { label: "Goals", value: player.goals, icon: Goal, color: "text-emerald-400" },
            { label: "Assists", value: player.assists, icon: Eye, color: "text-cyan-400" },
            { label: "Appearances", value: player.appearances, icon: Shield, color: "text-violet-400" },
            { label: "Yellow Cards", value: player.yellowCards, icon: Star, color: "text-yellow-400" },
            { label: "Red Cards", value: player.redCards, icon: Shield, color: "text-red-400" },
          ].map(stat => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <stat.icon className={cn("w-5 h-5 mx-auto mb-1", stat.color)} />
                <p className="text-2xl font-black text-white tabular-nums">{stat.value}</p>
                <p className="text-[10px] text-zinc-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader><CardTitle>Performance Overview</CardTitle></CardHeader>
              <CardContent className="p-5">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                      <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
                        labelStyle={{ color: "#a1a1aa" }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Match History</CardTitle></CardHeader>
              <CardContent className="p-4">
                {playerMatches.length === 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-4">No matches recorded</p>
                ) : (
                  <div className="space-y-2">
                    {playerMatches.slice(0, 5).map(m => (
                      <div key={m.id} className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{getFlagEmoji(m.homeTeam.code)}</span>
                          <span className="text-zinc-400 truncate max-w-[60px]">{m.homeTeam.shortName}</span>
                        </div>
                        <Badge variant={m.status === "finished" ? "default" : "outline"} className="text-[10px]">
                          {m.homeScore ?? "?"}-{m.awayScore ?? "?"}
                        </Badge>
                        <div className="flex items-center gap-1.5">
                          <span className="text-zinc-400 truncate max-w-[60px]">{m.awayTeam.shortName}</span>
                          <span className="text-sm">{getFlagEmoji(m.awayTeam.code)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Rating</CardTitle></CardHeader>
              <CardContent className="p-5 text-center">
                <div className="text-5xl font-black text-emerald-400">{player.rating}</div>
                <p className="text-xs text-zinc-500 mt-1">/ 10</p>
                <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                    initial={{ width: 0 }} animate={{ width: `${player.rating * 10}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {player.biography && (
          <Card className="mb-8">
            <CardHeader><CardTitle>Biography</CardTitle></CardHeader>
            <CardContent className="p-5">
              <p className="text-zinc-300 text-sm leading-relaxed">{player.biography}</p>
            </CardContent>
          </Card>
        )}

        {player.socialLinks && player.socialLinks.length > 0 && (
          <Card className="mb-8">
            <CardHeader><CardTitle>Social</CardTitle></CardHeader>
            <CardContent className="p-5">
              <div className="flex gap-3">
                {player.socialLinks.map(link => (
                  <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-emerald-400 transition-colors">
                    {link.platform === "Twitter" || link.platform === "X" ? <Globe className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center mb-10">
          <MonetagAdBanner width={728} height={90} position="middle" />
        </div>

        <div className="flex justify-center">
          <MonetagAdBanner width={728} height={90} position="bottom" />
        </div>
      </div>
    </div>
  );
}
