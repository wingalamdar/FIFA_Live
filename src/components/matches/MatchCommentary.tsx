"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CommentaryEntry } from "@/types";

interface MatchCommentaryProps {
  commentary: CommentaryEntry[];
}

const typeStyles = {
  goal: "border-l-emerald-400 bg-emerald-400/5",
  card: "border-l-yellow-400 bg-yellow-400/5",
  sub: "border-l-blue-400 bg-blue-400/5",
  miss: "border-l-red-400 bg-red-400/5",
  save: "border-l-cyan-400 bg-cyan-400/5",
  normal: "border-l-white/10 bg-white/5",
};

const typeBadge = {
  goal: "bg-emerald-400/20 text-emerald-400",
  card: "bg-yellow-400/20 text-yellow-400",
  sub: "bg-blue-400/20 text-blue-400",
  miss: "bg-red-400/20 text-red-400",
  save: "bg-cyan-400/20 text-cyan-400",
  normal: "bg-white/10 text-zinc-400",
};

export default function MatchCommentary({ commentary }: MatchCommentaryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [commentary.length]);

  if (!commentary.length) {
    return (
      <div className="text-center py-8 text-zinc-500 text-sm">No commentary available</div>
    );
  }

  const sorted = [...commentary].sort((a, b) => a.minute - b.minute);

  return (
    <div
      ref={scrollRef}
      className="max-h-[500px] overflow-y-auto space-y-2 pr-2 scrollbar-thin"
      style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }}
    >
      {sorted.map((entry, i) => (
        <motion.div
          key={entry.id}
          className={cn(
            "flex items-start gap-3 p-3 rounded-lg border-l-2",
            typeStyles[entry.type]
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
        >
          <span className={cn(
            "shrink-0 text-xs font-bold px-2 py-0.5 rounded font-mono",
            typeBadge[entry.type]
          )}>
            {entry.minute}&apos;
          </span>
          <p className="text-zinc-300 text-sm leading-relaxed">{entry.text}</p>
        </motion.div>
      ))}
    </div>
  );
}
