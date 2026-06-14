"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn, truncate, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { NewsArticle } from "@/types";

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const gradientFrom = `hsla(${(article.id.charCodeAt(0) * 47) % 360}, 70%, 40%, 0.2)`;
  const gradientTo = `hsla(${(article.id.charCodeAt(article.id.length - 1) * 53) % 360}, 70%, 30%, 0.2)`;

  return (
    <Link href={`/news/${article.slug}`}>
      <motion.div
        className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-emerald-400/20 transition-all h-full flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="relative h-44 overflow-hidden flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          {article.image ? (
            <img src={article.image} alt={article.title} className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <span className="text-5xl opacity-20 group-hover:scale-110 transition-transform duration-500">&#9917;</span>
          )}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
            <Badge variant="default" className="text-[10px] px-2 py-0.5">
              {article.category}
            </Badge>
            {article.trending && (
              <Badge variant="goal" className="text-[10px] px-2 py-0.5">
                Trending
              </Badge>
            )}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
            {truncate(article.title, 80)}
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed flex-1 line-clamp-2">
            {truncate(article.excerpt, 120)}
          </p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <span>{article.author}</span>
              <span>&middot;</span>
              <span>{formatDate(article.date)}</span>
            </div>
            <span className="text-emerald-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Read More &rarr;
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
