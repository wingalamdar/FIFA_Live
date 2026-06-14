import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { QueryProvider } from "@/components/layout/QueryProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LiveScoreTicker } from "@/components/layout/LiveScoreTicker";
import { StickyBottomAd } from "@/components/ads/StickyBottomAd";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 - Live Scores, News, Standings & Predictions",
  description: "Ultimate FIFA World Cup 2026 coverage. Live scores, match schedules, group standings, team stats, player profiles, AI predictions, latest news and more.",
  other: {
    "monetag": "3ffb7256cfecdd8f61114251e8214a19",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="dark bg-[#0a0a0f] text-white antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <QueryProvider>
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
            <LiveScoreTicker />
            <StickyBottomAd />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
