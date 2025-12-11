import { NextResponse } from "next/server";
import { google } from "googleapis";
import { supabase } from "@/lib/supabase";
import { userOAuth2Client } from "@/lib/auth/google/auth";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { data: userRow, error: userFetchError } = await supabase
      .from("user_tokens")
      .select("access_token, refresh_token")
      .eq("user_id", userId)
      .eq("provider", "google")
      .single();

    if (userFetchError || !userRow?.access_token) {
      return NextResponse.json(
        { error: "Google not connected for this user" },
        { status: 400 },
      );
    }

    userOAuth2Client.setCredentials({
      access_token: userRow.access_token,
      refresh_token: userRow.refresh_token,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: userOAuth2Client,
    });

    const now = new Date();
    const timeMin = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const timeMax = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const eventsRes = await calendar.events.list({
      calendarId: "primary",
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      showDeleted: false,
      maxResults: 2500,
    });

    const items = eventsRes.data.items || [];

    const parsedEvents = items.map((event) => ({
      external_id: event.iCalUID || event.id,
      user_id: userId,
      provider: "google",
      title: event.summary,
      description: event.description,
      location: event.location,
      is_all_day: !!event.start?.date,
      is_recurring:
        Array.isArray(event.recurrence) && event.recurrence.length > 0,
      start_time: event.start?.dateTime || event.start,
      end_time: event.end?.dateTime || event.end,
      recurrence_rule: event.recurrence?.[0] || null,
      recurring_event_id: event.recurringEventId || null,
      status: event.status || null,
      timezone: event.start?.timeZone || null,
      visibility: "temporary",
      raw: event,
    }));

    const { error } = await supabase
      .from("calendar_events")
      .upsert(parsedEvents, { onConflict: "external_id" });

    if (error) {
      console.error("Error upserting events:", error);
      return NextResponse.json(
        { error: "Failed to save events" },
        { status: 500 },
      );
    }

    const { error: userError } = await supabase
      .from("users")
      .update({ google_calendar_synced_at: new Date().toISOString() })
      .eq("id", userId);

    if (userError) {
      console.error("Error updating user:", userError);
    }

    return NextResponse.json({ ok: true, count: parsedEvents.length });
  } catch (err) {
    console.error("auto-sync error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
