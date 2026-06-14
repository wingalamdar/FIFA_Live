"use client";

import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.span
        key={value}
        className="text-3xl sm:text-4xl lg:text-5xl font-black tabular-nums"
        style={{ textShadow: "0 0 20px rgba(52,211,153,0.4), 0 0 40px rgba(52,211,153,0.2)" }}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {String(value).padStart(2, "0")}
      </motion.span>
      <span className="text-zinc-500 text-xs sm:text-sm uppercase tracking-widest mt-1">
        {label}
      </span>
    </div>
  );
}

export default function CountdownWidget() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown("2026-06-11T00:00:00");

  if (isExpired) {
    return (
      <div className="inline-flex items-center gap-3 bg-emerald-400/10 rounded-xl px-5 py-3 border border-emerald-400/20">
        <span className="text-emerald-400 font-bold text-lg">The tournament has begun!</span>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col items-center sm:items-start gap-3">
      <p className="text-zinc-400 text-sm font-medium tracking-wide">
        FIFA World Cup 2026 Starts In
      </p>
      <div className="flex gap-4 sm:gap-6">
        <CountdownBlock value={days} label="Days" />
        <span className="text-zinc-700 text-3xl sm:text-4xl font-black self-start mt-1">:</span>
        <CountdownBlock value={hours} label="Hours" />
        <span className="text-zinc-700 text-3xl sm:text-4xl font-black self-start mt-1">:</span>
        <CountdownBlock value={minutes} label="Mins" />
        <span className="text-zinc-700 text-3xl sm:text-4xl font-black self-start mt-1">:</span>
        <CountdownBlock value={seconds} label="Secs" />
      </div>
    </div>
  );
}
