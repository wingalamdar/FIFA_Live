import Link from "next/link";
import { Trophy } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/live-scores", label: "Live Scores" },
  { href: "/schedule", label: "Schedule" },
  { href: "/standings", label: "Standings" },
  { href: "/predictions", label: "Predictions" },
  { href: "/news", label: "News" },
];

const socialLinks = [
  { label: "Twitter / X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "TikTok", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <Trophy className="w-6 h-6 text-emerald-400" />
              <span className="text-lg font-bold text-white">
                FIFA<span className="text-emerald-400">2026</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your ultimate destination for FIFA World Cup 2026 scores, standings, predictions, and news.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Follow Us</h3>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Disclaimer</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              This site is not affiliated with FIFA. All trademarks are property of their respective owners.
              This website uses Monetag ad technology to provide relevant advertisements.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} FIFA World Cup 2026. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Powered by Monetag</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>Unofficial fan site</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
