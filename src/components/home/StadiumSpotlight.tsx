"use client";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const stadiums = [
  { name: "MetLife Stadium", location: "New York/New Jersey", capacity: "82,500", image: "🏟️", matches: "Final, Semi-final" },
  { name: "AT&T Stadium", location: "Dallas, Texas", capacity: "80,000", image: "🏟️", matches: "Semi-final, QF" },
  { name: "SoFi Stadium", location: "Los Angeles, CA", capacity: "70,240", image: "🏟️", matches: "Third Place, QF" },
  { name: "Estadio Azteca", location: "Mexico City", capacity: "87,523", image: "🏟️", matches: "Group Stage, R16" },
];

export default function StadiumSpotlight() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Stadium Spotlight</h2>
          <p className="text-zinc-400 mt-1 text-sm">Iconic venues hosting World Cup 2026</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stadiums.map((stadium, i) => (
            <motion.div
              key={stadium.name} initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5 hover:bg-white/10 transition-colors group"
            >
              <div className="text-4xl mb-4 opacity-30 group-hover:opacity-50 transition-opacity">{stadium.image}</div>
              <h3 className="text-white font-semibold text-base mb-1">{stadium.name}</h3>
              <div className="flex items-center gap-1 text-xs text-zinc-500 mb-3">
                <MapPin className="w-3 h-3" />
                <span>{stadium.location}</span>
              </div>
              <div className="text-xs text-zinc-600">
                <span>Capacity: {stadium.capacity}</span>
              </div>
              <div className="mt-2 text-[10px] px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 inline-block">
                {stadium.matches}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
