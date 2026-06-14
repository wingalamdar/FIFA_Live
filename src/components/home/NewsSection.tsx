"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getTrendingNews } from "@/lib/api";
import { formatDate, truncate } from "@/lib/utils";
import type { NewsArticle } from "@/types";

function NewsCard({ article, index }: { article: NewsArticle; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/news/${article.slug}`}>
        <div className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all h-full flex flex-col">
          <div className="relative h-44 overflow-hidden bg-gradient-to-br from-emerald-500/20 via-black to-cyan-500/20 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            {article.image ? (
              <img src={article.image} alt={article.title} className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <span className="text-5xl opacity-20 group-hover:scale-110 transition-transform duration-500">⚽</span>
            )}
            <div className="absolute top-3 left-3 z-20">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-400 border border-emerald-400/30">
                {article.category}
              </span>
            </div>
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed flex-1 line-clamp-2">
              {truncate(article.excerpt, 120)}
            </p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <span className="text-zinc-600 text-xs">{formatDate(article.date)}</span>
              <span className="text-emerald-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Read More &rarr;
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    getTrendingNews().then(setNews);
  }, []);

  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Latest News</h2>
            <p className="text-zinc-400 mt-1 text-sm">Trending stories from the World Cup</p>
          </div>
          <Link
            href="/news"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
          >
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {news.map((article, i) => (
            <NewsCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
