"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Frown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <motion.h1
          className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-9xl font-black text-transparent"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          404
        </motion.h1>
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-400" />
          <Frown className="h-8 w-8 text-gray-400" />
          <Trophy className="h-8 w-8 text-yellow-400" />
        </div>
        <p className="text-2xl font-semibold text-gray-300">Page Not Found</p>
        <p className="max-w-md text-center text-gray-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-3 font-semibold text-black transition-shadow hover:shadow-lg hover:shadow-orange-500/25"
          >
            Back to Home
          </motion.span>
        </Link>
      </motion.div>
    </div>
  );
}
