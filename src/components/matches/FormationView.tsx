"use client";

import { cn } from "@/lib/utils";

interface FormationPlayer {
  number: number;
  name: string;
  position: { x: number; y: number };
}

interface FormationViewProps {
  formation: string;
  players: FormationPlayer[];
}

export default function FormationView({ formation, players }: FormationViewProps) {
  return (
    <div className="relative w-full aspect-[3/4] max-w-[400px] mx-auto rounded-xl overflow-hidden bg-gradient-to-b from-emerald-900/30 via-emerald-800/40 to-emerald-900/30 border border-white/10">
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 100 140" className="w-full h-full">
          <rect x="5" y="5" width="90" height="130" fill="none" stroke="white" strokeWidth="0.5" />
          <line x1="50" y1="5" x2="50" y2="135" stroke="white" strokeWidth="0.5" />
          <circle cx="50" cy="70" r="15" fill="none" stroke="white" strokeWidth="0.5" />
          <rect x="30" y="63" width="40" height="14" fill="none" stroke="white" strokeWidth="0.3" />
          <rect x="13" y="5" width="12" height="24" fill="none" stroke="white" strokeWidth="0.3" />
          <rect x="75" y="5" width="12" height="24" fill="none" stroke="white" strokeWidth="0.3" />
          <rect x="13" y="111" width="12" height="24" fill="none" stroke="white" strokeWidth="0.3" />
          <rect x="75" y="111" width="12" height="24" fill="none" stroke="white" strokeWidth="0.3" />
        </svg>
      </div>

      <div className="absolute top-3 left-1/2 -translate-x-1/2">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/60 backdrop-blur text-emerald-400 border border-emerald-400/30">
          {formation}
        </span>
      </div>

      {players.map((player) => (
        <div
          key={player.number}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          style={{
            left: `${player.position.x * 100}%`,
            top: `${player.position.y * 100}%`,
          }}
        >
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center",
            "bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 backdrop-blur",
            "border-2 border-emerald-400/50 shadow-lg shadow-emerald-400/10"
          )}>
            <span className="text-sm font-bold text-white">{player.number}</span>
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 truncate max-w-[60px] text-center leading-tight">
            {player.name.split(" ").pop()}
          </span>
        </div>
      ))}
    </div>
  );
}
