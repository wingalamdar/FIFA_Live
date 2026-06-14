import { NextResponse } from "next/server";
import { predictions } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(predictions);
}
