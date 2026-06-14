import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug, getNews } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MonetagAdBanner } from "@/components/ads/MonetagAdBanner";
import { Calendar, User, Share2, ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} - FIFA World Cup 2026`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      tags: article.tags,
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  const allNews = await getNews();
  const relatedArticles = allNews.filter(a => a.slug !== slug && (a.category === article.category || a.tags.some(t => article.tags.includes(t)))).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: { "@type": "Person", name: article.author },
    articleSection: article.category,
    keywords: article.tags.join(", "),
  };

  return (
    <div className="min-h-screen pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/news" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="default">{article.category}</Badge>
            {article.trending && <Badge variant="live">Trending</Badge>}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {article.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(article.date)}</span>
            <span>{article.views.toLocaleString()} views</span>
          </div>
        </div>

        <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500/20 via-black to-cyan-500/20 flex items-center justify-center mb-8">
          {article.image ? (
            <img src={article.image} alt={article.title} className="w-full h-full object-cover absolute inset-0" />
          ) : (
            <span className="text-8xl opacity-10">⚽</span>
          )}
          <div className="absolute bottom-4 left-4 text-xs text-zinc-600">Illustrative image</div>
        </div>

        <div className="flex justify-center mb-6">
          <MonetagAdBanner width={728} height={90} position="top" />
        </div>

        <div className="prose prose-invert max-w-none">
          {article.content.split("\n").map((paragraph, i) => {
            const trimmed = paragraph.trim();
            const tweetMatch = trimmed.match(/^https?:\/\/(x\.com|twitter\.com)\/\w+\/status\/(\d+)/);
            if (tweetMatch) {
              const tweetUrl = tweetMatch[0].split("?")[0];
              return (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 my-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">X</div>
                    <div>
                      <div className="text-white text-sm font-semibold">FIFA World Cup</div>
                      <div className="text-zinc-500 text-xs">@FIFAWorldCup</div>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm mb-3">View this post on X (formerly Twitter)</p>
                  <a href={tweetUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-blue-400/10 px-4 py-2 rounded-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    View on X
                  </a>
                </div>
              );
            }
            return (
              <p key={i} className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-4">
                {trimmed}
              </p>
            );
          })}
        </div>

        <div className="flex justify-center my-8">
          <MonetagAdBanner width={728} height={90} position="middle" />
        </div>

        {article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-sm font-semibold text-white mb-3">Tags</h3>
            <div className="flex gap-2 flex-wrap">
              {article.tags.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href="/news"><ArrowLeft className="w-4 h-4 mr-1" /> All News</Link>
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-1" /> Share Article
          </Button>
        </div>

        {relatedArticles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map(related => (
                <Link key={related.id} href={`/news/${related.slug}`} className="group">
                  <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-colors h-full">
                    <Badge variant="outline" className="text-[10px] mb-2">{related.category}</Badge>
                    <h3 className="text-white text-sm font-semibold group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-zinc-500 text-xs mt-2 line-clamp-2">{related.excerpt}</p>
                    <div className="text-zinc-600 text-[10px] mt-3">{formatDate(related.date)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <MonetagAdBanner width={728} height={90} position="bottom" />
        </div>
      </div>
    </div>
  );
}
