"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { getMatches } from "@/lib/api";
import { formatDate, formatTime, getFlagEmoji, cn } from "@/lib/utils";
import type { Match } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MonetagAdBanner } from "@/components/ads/MonetagAdBanner";

const stages = ["Group Stage", "Round of 16", "Quarter-final", "Semi-final", "Third Place", "Final"];

function groupMatchesByDate(matches: Match[]) {
  const grouped: Record<string, Match[]> = {};
  matches.forEach(m => {
    if (!grouped[m.date]) grouped[m.date] = [];
    grouped[m.date].push(m);
  });
  return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
}

function MatchCard({ match, index }: { match: Match; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03, duration: 0.3 }}>
      <Card className="hover:bg-white/10 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <span className="text-2xl">{getFlagEmoji(match.homeTeam.code)}</span>
              <span className="text-white font-semibold text-sm truncate">{match.homeTeam.shortName}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={cn("text-xl font-black tabular-nums w-8 text-center", match.status === "live" ? "text-emerald-400" : match.homeScore !== null ? "text-white" : "text-zinc-500")}>
                {match.homeScore ?? "-"}
              </span>
              <span className="text-zinc-600 text-xs font-bold">vs</span>
              <span className={cn("text-xl font-black tabular-nums w-8 text-center", match.status === "live" ? "text-emerald-400" : match.awayScore !== null ? "text-white" : "text-zinc-500")}>
                {match.awayScore ?? "-"}
              </span>
            </div>
            <div className="flex-1 flex items-center gap-3 min-w-0 justify-end">
              <span className="text-white font-semibold text-sm truncate">{match.awayTeam.shortName}</span>
              <span className="text-2xl">{getFlagEmoji(match.awayTeam.code)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-zinc-600">
            <div className="flex items-center gap-2">
              <span>{formatTime(match.time)}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span className="truncate max-w-[200px]">{match.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              {match.group !== "KO" && <span className="text-zinc-600">Group {match.group}</span>}
              <Badge variant={match.stage === "Group Stage" ? "outline" : "goal"} className="text-[10px]">
                {match.stage}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [allMatches, setAllMatches] = useState<Match[]>([]);

  useEffect(() => {
    getMatches()
      .then(setAllMatches)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const groups = useMemo(() => Array.from(new Set(allMatches.filter(m => m.group !== "KO").map(m => m.group))).sort(), [allMatches]);

  const availableDates = useMemo(() => Array.from(new Set(allMatches.map(m => m.date))).sort(), [allMatches]);

  const filteredMatches = useMemo(() => {
    let filtered = [...allMatches];
    if (selectedGroup !== "all") filtered = filtered.filter(m => m.group === selectedGroup);
    if (selectedStage !== "all") filtered = filtered.filter(m => m.stage === selectedStage);
    return filtered;
  }, [selectedGroup, selectedStage, allMatches]);

  const grouped = useMemo(() => groupMatchesByDate(filteredMatches), [filteredMatches]);

  const currentIndex = availableDates.indexOf(selectedDate);

  const goToDate = (dir: "prev" | "next") => {
    const newIndex = dir === "prev" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < availableDates.length) setSelectedDate(availableDates[newIndex]);
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">Match Schedule</h1>
            <p className="text-zinc-400 text-sm mt-1">All fixtures at a glance</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/10">
            <Button variant="ghost" size="icon" onClick={() => goToDate("prev")} disabled={currentIndex <= 0}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 px-3">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
              <input
                type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                className="bg-transparent text-sm text-white focus:outline-none [color-scheme:dark]"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => goToDate("next")} disabled={currentIndex >= availableDates.length - 1}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}
              className="text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-emerald-400/50"
            >
              <option value="all">All Groups</option>
              {groups.map(g => <option key={g} value={g}>Group {g}</option>)}
              <option value="KO">Knockouts</option>
            </select>
            <select
              value={selectedStage} onChange={e => setSelectedStage(e.target.value)}
              className="text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-emerald-400/50"
            >
              <option value="all">All Stages</option>
              {stages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {grouped.map(([date, dayMatches]) => (
                <motion.div key={date} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{formatDate(date)}</span>
                      {date === selectedDate && <Badge variant="default" className="text-[10px]">Selected</Badge>}
                    </h2>
                    <span className="text-xs text-zinc-500">{dayMatches.length} match{dayMatches.length !== 1 ? "es" : ""}</span>
                  </div>
                  <div className="space-y-3">
                    {dayMatches.map((match, i) => (
                      <MatchCard key={match.id} match={match} index={i} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredMatches.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4 opacity-20">📅</div>
                <h3 className="text-xl font-semibold text-zinc-400 mb-2">No matches found</h3>
                <p className="text-zinc-600 text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Knockout Bracket Preview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {["Round of 16", "Quarter-final", "Semi-final", "Final"].map((stage, si) => {
              const stageMatches = allMatches.filter(m => m.stage === stage);
              return (
                <Card key={stage}>
                  <CardContent className="p-4">
                    <Badge variant="goal" className="mb-3">{stage}</Badge>
                    {stageMatches.length === 0 ? (
                      <p className="text-xs text-zinc-600">TBD</p>
                    ) : (
                      <div className="space-y-2">
                        {stageMatches.map(m => (
                          <div key={m.id} className="text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400 truncate">{m.homeTeam.shortName}</span>
                              <span className="font-bold text-white mx-1">{m.homeScore ?? "?"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400 truncate">{m.awayTeam.shortName}</span>
                              <span className="font-bold text-white mx-1">{m.awayScore ?? "?"}</span>
                            </div>
                            <div className="text-zinc-600 mt-1">{formatDate(m.date)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center">
          <MonetagAdBanner width={728} height={90} position="bottom" />
        </div>
      </div>
    </div>
  );
}
