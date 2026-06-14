import { NextResponse } from "next/server";
import { news } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(news);
}
