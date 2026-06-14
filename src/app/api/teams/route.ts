import { NextResponse } from "next/server";
import { teams } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(teams);
}
