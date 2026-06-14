"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, MessageCircle, Link, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const shareLinks = {
  twitter: (url: string, title: string) =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  facebook: (url: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  whatsapp: (url: string, title: string) =>
    `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
};

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const buttons = [
    {
      icon: X,
      label: "Share on X",
      href: shareLinks.twitter(url, title),
      color: "hover:bg-white/10 hover:text-white",
    },
    {
      icon: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
      label: "Share on Facebook",
      href: shareLinks.facebook(url),
      color: "hover:bg-blue-500/20 hover:text-blue-400",
    },
    {
      icon: MessageCircle,
      label: "Share on WhatsApp",
      href: shareLinks.whatsapp(url, title),
      color: "hover:bg-emerald-500/20 hover:text-emerald-400",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {buttons.map(({ icon: Icon, label, href, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={label}
          className={cn(
            "w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 transition-all",
            color
          )}
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}

      <motion.button
        onClick={copyLink}
        title={copied ? "Copied!" : "Copy link"}
        className={cn(
          "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
          copied
            ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-400"
            : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white"
        )}
        whileTap={{ scale: 0.9 }}
      >
        {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
      </motion.button>
    </div>
  );
}
