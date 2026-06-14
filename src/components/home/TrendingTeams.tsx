"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getTeams } from "@/lib/api";
import { getFlagEmoji, cn } from "@/lib/utils";
import type { Team } from "@/types";

export default function TrendingTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    getTeams().then(setTeams);
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener("scroll", checkScroll);
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [teams]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (el) {
      const amount = 300;
      el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Trending Teams</h2>
            <p className="text-zinc-400 mt-1 text-sm">Top ranked nations in the tournament</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className={cn(
                "p-2.5 rounded-xl border transition-all",
                canScrollLeft
                  ? "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                  : "border-white/5 text-zinc-700 cursor-not-allowed"
              )}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className={cn(
                "p-2.5 rounded-xl border transition-all",
                canScrollRight
                  ? "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                  : "border-white/5 text-zinc-700 cursor-not-allowed"
              )}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <div className="relative">
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          )}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {teams.map((team, i) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
              >
                <Link href={`/teams/${team.id}`}>
                  <motion.div
                    className="flex-shrink-0 w-44 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5 hover:bg-white/10 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <div className="text-4xl mb-3">{team.flag}</div>
                    <h3 className="text-white font-semibold text-sm truncate">{team.name}</h3>
                    <div className="flex items-center justify-between mt-2 text-xs text-zinc-500">
                      <span>Group {team.group}</span>
                      <span className="bg-white/5 px-2 py-0.5 rounded-full">#{team.rank}</span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
          )}
        </div>
      </div>
    </section>
  );
}
