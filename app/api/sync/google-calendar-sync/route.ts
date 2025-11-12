import { googleCalendarSyncUrl } from "@/lib/auth/google/auth";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ url: googleCalendarSyncUrl });
}
