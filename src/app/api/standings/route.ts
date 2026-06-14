import { NextResponse } from "next/server";
import { standings } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(standings);
}
