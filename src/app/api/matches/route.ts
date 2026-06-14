import { NextResponse } from "next/server";
import { matches } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(matches);
}
