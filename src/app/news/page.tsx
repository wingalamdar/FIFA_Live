"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { TrendingUp, Clock } from "lucide-react";
import { getNews } from "@/lib/api";
import { formatDate, truncate, cn } from "@/lib/utils";
import type { NewsArticle } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MonetagAdBanner } from "@/components/ads/MonetagAdBanner";

const categories = ["All", "Match Report", "Preview", "Transfer", "Analysis", "Rumors", "Feature", "Player Focus", "Record", "Highlights", "Team Feature"];

function NewsCard({ article, index }: { article: NewsArticle; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      layout
    >
      <Link href={`/news/${article.slug}`}>
        <Card className="group overflow-hidden hover:bg-white/10 transition-colors h-full flex flex-col">
          <div className="relative h-48 bg-gradient-to-br from-emerald-500/20 via-black to-cyan-500/20 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            {article.image ? (
              <img src={article.image} alt={article.title} className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <span className="text-6xl opacity-20 group-hover:scale-125 transition-transform duration-500">📰</span>
            )}
            <div className="absolute top-3 left-3 z-20">
              <Badge variant={article.category === "Match Report" ? "default" : article.category === "Rumors" ? "destructive" : "goal"}>
                {article.category}
              </Badge>
            </div>
            {article.trending && (
              <div className="absolute top-3 right-3 z-20">
                <Badge variant="live" className="text-[10px]">Trending</Badge>
              </div>
            )}
          </div>
          <CardContent className="p-5 flex flex-col flex-1">
            <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
              {truncate(article.excerpt, 150)}
            </p>
            <div className="flex items-center justify-between text-xs pt-4 border-t border-white/5 mt-auto">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-zinc-600" />
                <span className="text-zinc-500">{formatDate(article.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600">
                <span>{article.views.toLocaleString()} views</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(9);
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    getNews().then(setAllNews).catch(() => {});
  }, []);

  const filteredNews = useMemo(() => {
    return activeCategory === "All" ? allNews : allNews.filter(a => a.category === activeCategory);
  }, [activeCategory, allNews]);

  const trendingNews = useMemo(() => allNews.filter(a => a.trending).slice(0, 5), [allNews]);

  const displayNews = filteredNews.slice(0, visibleCount);
  const hasMore = visibleCount < filteredNews.length;

  const loadMore = () => setVisibleCount(prev => prev + 6);

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-white">Latest News</h1>
          <p className="text-zinc-400 text-sm mt-1">Stay updated with World Cup 2026 coverage</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex gap-2 flex-wrap mb-8 overflow-x-auto scrollbar-hide pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setVisibleCount(9); }}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-all border",
                    activeCategory === cat
                      ? "bg-emerald-500 text-black font-medium border-emerald-500"
                      : "bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:bg-white/10"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {displayNews.map((article, i) => (
                  <NewsCard key={article.id} article={article} index={i} />
                ))}
              </div>
            </AnimatePresence>

            {displayNews.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4 opacity-20">📰</div>
                <h3 className="text-xl font-semibold text-zinc-400">No articles found</h3>
                <p className="text-zinc-600 text-sm mt-1">Try a different category</p>
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-10">
                <Button variant="outline" onClick={loadMore}>
                  Load More Articles
                </Button>
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <MonetagAdBanner width={728} height={90} position="middle" />
            </div>
          </div>

          <aside className="lg:w-80 shrink-0">
            <Card>
              <CardContent className="p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Trending Stories
                </h3>
                <div className="space-y-4">
                  {trendingNews.map((article, i) => (
                    <Link key={article.id} href={`/news/${article.slug}`} className="group block">
                      <div className="flex gap-3">
                        <span className="text-lg font-black text-zinc-600 w-6 shrink-0">{i + 1}</span>
                        <div>
                          <h4 className="text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-600">
                            <Badge variant="outline" className="text-[8px] px-1.5 py-0">{article.category}</Badge>
                            <span>{article.views.toLocaleString()} views</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <MonetagAdBanner width={300} height={250} position="sidebar" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
