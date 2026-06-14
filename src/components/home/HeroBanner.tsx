"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { getLiveMatches } from "@/lib/api";
import { getFlagEmoji, cn } from "@/lib/utils";
import type { Match } from "@/types";
import LiveMatchWidget from "./LiveMatchWidget";
import CountdownWidget from "./CountdownWidget";

export default function HeroBanner() {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const countdown = useCountdown("2026-06-11");

  useEffect(() => {
    getLiveMatches().then(setLiveMatches);
  }, []);

  const nextSlide = useCallback(() => {
    if (liveMatches.length > 1) {
      setCurrentSlide((prev) => (prev + 1) % liveMatches.length);
    }
  }, [liveMatches.length]);

  const prevSlide = useCallback(() => {
    if (liveMatches.length > 1) {
      setCurrentSlide((prev) => (prev - 1 + liveMatches.length) % liveMatches.length);
    }
  }, [liveMatches.length]);

  useEffect(() => {
    if (liveMatches.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [liveMatches.length, nextSlide]);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-black to-cyan-900/30"
        style={{ backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(52,211,153,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(34,211,238,0.1) 0%, transparent 50%)" }}
      />
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          background: "linear-gradient(-45deg, rgba(52,211,153,0.3), rgba(34,211,238,0.2), rgba(52,211,153,0.1), rgba(34,211,238,0.3))",
          backgroundSize: "400% 400%",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="text-emerald-400 font-semibold tracking-widest uppercase text-sm mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              North America 2026
            </motion.p>
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ textShadow: "0 0 30px rgba(52,211,153,0.5), 0 0 60px rgba(52,211,153,0.3)" }}
            >
              <span className="text-white">FIFA World Cup</span>{" "}
              <span className="text-emerald-400">2026</span>
            </motion.h1>
            <motion.p
              className="text-zinc-400 text-lg sm:text-xl mt-6 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              The greatest show on Earth comes to North America. 48 nations, 104 matches, one champion.
            </motion.p>
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <CountdownWidget />
            </motion.div>
          </motion.div>

          <motion.div
            className="w-full lg:w-[420px] xl:w-[480px]"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {liveMatches.length > 0 ? (
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.4 }}
                  >
                    <LiveMatchWidget match={liveMatches[currentSlide]} />
                  </motion.div>
                </div>
                {liveMatches.length > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={prevSlide}
                      className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                      {liveMatches.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentSlide(i)}
                          className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            i === currentSlide ? "bg-emerald-400 w-6" : "bg-white/20 hover:bg-white/40"
                          )}
                        />
                      ))}
                    </div>
                    <button
                      onClick={nextSlide}
                      className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
                <Clock className="mx-auto mb-4 text-emerald-400" size={48} />
                <p className="text-zinc-400 text-lg">No live matches right now</p>
                <p className="text-zinc-600 text-sm mt-2">Check back when the tournament starts</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
