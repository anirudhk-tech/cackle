import { getGoogleCalendarSyncUrl } from "@/lib/auth/google/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const { linkId } = data;
  return NextResponse.json({ url: getGoogleCalendarSyncUrl(linkId) });
}
