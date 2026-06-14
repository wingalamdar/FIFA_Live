"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { getMatches, getLiveMatches } from "@/lib/api";
import { formatDate, formatTime, getFlagEmoji, cn } from "@/lib/utils";
import type { Match } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GlowingDot } from "@/components/ui/GlowingDot";
import { MonetagAdBanner } from "@/components/ads/MonetagAdBanner";

type FilterTab = "all" | "live" | "today" | "finished";

const filters: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "today", label: "Today" },
  { key: "finished", label: "Finished" },
];

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function MatchCard({ match }: { match: Match }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {match.status === "live" && <GlowingDot color="red" />}
                <Badge variant={match.status === "live" ? "live" : match.status === "finished" ? "default" : "outline"}>
                  {match.status === "live" ? `LIVE ${match.minute || 0}'` : match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                </Badge>
                {match.stage !== "Group Stage" && (
                  <Badge variant="goal">{match.stage}</Badge>
                )}
              </div>
              <span className="text-xs text-zinc-500">{formatTime(match.time)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-3xl">{getFlagEmoji(match.homeTeam.code)}</span>
                <span className="text-white font-semibold truncate">{match.homeTeam.name}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={cn("text-3xl sm:text-4xl font-black tabular-nums", match.status === "live" ? "text-emerald-400" : "text-white")}>
                  {match.homeScore ?? "-"}
                </span>
                <span className="text-zinc-600 text-xl font-bold">:</span>
                <span className={cn("text-3xl sm:text-4xl font-black tabular-nums", match.status === "live" ? "text-emerald-400" : "text-white")}>
                  {match.awayScore ?? "-"}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                <span className="text-white font-semibold truncate">{match.awayTeam.name}</span>
                <span className="text-3xl">{getFlagEmoji(match.awayTeam.code)}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-zinc-600">
              <span>{match.venue}</span>
              <span>{match.group !== "KO" ? `Group ${match.group}` : match.round}</span>
            </div>

            {match.possession && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                  <span>Possession: {match.possession.home}%</span>
                  <span>{match.possession.away}%</span>
                </div>
                <div className="flex h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="bg-emerald-400" style={{ width: `${match.possession.home}%` }} />
                  <div className="bg-cyan-400" style={{ width: `${match.possession.away}%` }} />
                </div>
              </div>
            )}
          </div>

          {match.events && match.events.length > 0 && (
            <>
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-center gap-1 py-2 text-xs text-zinc-500 hover:text-zinc-300 border-t border-white/5 transition-colors"
              >
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {expanded ? "Hide Events" : `${match.events.length} Events`}
              </button>
              <AnimatePresence>
                {expanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-white/5">
                    <div className="grid grid-cols-2 gap-4 p-4">
                      <div className="space-y-1.5">
                        {match.events.filter(e => e.team === "home").map(event => (
                          <div key={event.id} className="flex items-center gap-2 text-xs text-zinc-400">
                            <span>{event.type === "goal" || event.type === "penalty" || event.type === "own_goal" ? "⚽" : event.type === "yellow_card" ? "🟨" : event.type === "red_card" ? "🟥" : "🔄"}</span>
                            <span>{event.player}</span>
                            <span className="text-zinc-600 ml-auto">{event.minute}&apos;</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1.5 text-right">
                        {match.events.filter(e => e.team === "away").map(event => (
                          <div key={event.id} className="flex items-center gap-2 text-xs text-zinc-400 justify-end">
                            <span className="text-zinc-600">{event.minute}&apos;</span>
                            <span>{event.player}</span>
                            <span>{event.type === "goal" || event.type === "penalty" || event.type === "own_goal" ? "⚽" : event.type === "yellow_card" ? "🟨" : event.type === "red_card" ? "🟥" : "🔄"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MatchSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-10 w-24" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-3 w-48 mx-auto" />
      </CardContent>
    </Card>
  );
}

export default function LiveScoresPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [allMatches, setAllMatches] = useState<Match[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [all, live] = await Promise.all([getMatches(), getLiveMatches()]);
      const merged = all.map(m => live.find(l => l.id === m.id) || m);
      setAllMatches(merged);
    } catch {
      // keep existing data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filterMatches = useCallback(() => {
    let filtered = [...allMatches];
    if (activeFilter === "live") filtered = filtered.filter(m => m.status === "live");
    else if (activeFilter === "today") filtered = filtered.filter(m => m.date === getTodayDate());
    else if (activeFilter === "finished") filtered = filtered.filter(m => m.status === "finished");
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(m => m.homeTeam.name.toLowerCase().includes(q) || m.awayTeam.name.toLowerCase().includes(q) || m.venue.toLowerCase().includes(q));
    }
    return filtered;
  }, [activeFilter, searchQuery, allMatches]);

  const liveCount = allMatches.filter(m => m.status === "live").length;
  const displayMatches = filterMatches();

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black text-white">Live Scores</h1>
            {liveCount > 0 && (
              <Badge variant="live" className="text-sm px-3 py-1">
                <span className="relative flex h-2 w-2 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                {liveCount} LIVE
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={cn("px-3 py-1.5 text-sm rounded-md transition-all", activeFilter === f.key ? "bg-emerald-500 text-black font-medium" : "text-zinc-400 hover:text-white")}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text" placeholder="Search teams or venue..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/50"
            />
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <MatchSkeleton key={i} />)
          ) : displayMatches.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <div className="text-6xl mb-4 opacity-20">⚽</div>
              <h3 className="text-xl font-semibold text-zinc-400 mb-2">No matches found</h3>
              <p className="text-zinc-600 text-sm">Try a different filter or check back later for live action</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {displayMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <MonetagAdBanner width={728} height={90} position="bottom" />
        </div>
      </div>
    </div>
  );
}
