import type { Metadata } from "next";
import HeroBanner from "@/components/home/HeroBanner";
import CountdownWidget from "@/components/home/CountdownWidget";
import LiveMatchWidget from "@/components/home/LiveMatchWidget";
import TrendingTeams from "@/components/home/TrendingTeams";
import NewsSection from "@/components/home/NewsSection";
import TopScorers from "@/components/home/TopScorers";
import GroupStandingsPreview from "@/components/home/GroupStandingsPreview";
import UpcomingMatches from "@/components/home/UpcomingMatches";
import StadiumSpotlight from "@/components/home/StadiumSpotlight";
import { MonetagAdBanner } from "@/components/ads/MonetagAdBanner";

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 - Live Scores, News, Standings & Predictions",
  description: "Your ultimate destination for FIFA World Cup 2026 coverage. Live scores, match schedules, group standings, team stats, player profiles, AI predictions, and breaking news.",
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex justify-center">
          <MonetagAdBanner width={728} height={90} position="top" />
        </div>
      </div>
      <TrendingTeams />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <MonetagAdBanner width={728} height={90} position="middle" />
        </div>
      </div>
      <UpcomingMatches />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <MonetagAdBanner width={728} height={90} position="middle" />
        </div>
      </div>
      <GroupStandingsPreview />
      <TopScorers />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <MonetagAdBanner width={728} height={90} position="middle" />
        </div>
      </div>
      <NewsSection />
      <StadiumSpotlight />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <MonetagAdBanner width={728} height={90} position="bottom" />
        </div>
      </div>
    </div>
  );
}
