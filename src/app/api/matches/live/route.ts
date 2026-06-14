import { NextResponse } from "next/server";
import { matches } from "@/lib/mockData";

export async function GET() {
  const live = matches.filter((m) => m.status === "live");
  return NextResponse.json(live);
}
