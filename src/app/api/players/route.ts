import { NextResponse } from "next/server";
import { players } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(players);
}
