import { NextResponse } from "next/server";
import { teams, players, news } from "@/lib/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  const teamResults = teams.filter(
    (t) => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q)
  );
  const playerResults = players.filter(
    (p) => p.name.toLowerCase().includes(q)
  );
  const newsResults = news.filter(
    (a) => a.title.toLowerCase().includes(q)
  );

  return NextResponse.json({ teams: teamResults, players: playerResults, news: newsResults });
}
