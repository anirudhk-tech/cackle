import { getUserGoogleCalendarSyncUrl } from "@/lib/auth/google/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const { userId } = data;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  return NextResponse.json({ url: getUserGoogleCalendarSyncUrl(userId) });
}
