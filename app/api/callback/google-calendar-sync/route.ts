import { userOAuth2Client } from "@/lib/auth/google/auth";
import { supabase } from "@/lib/supabase";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const userId = searchParams.get("state");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const { tokens } = await userOAuth2Client.getToken(code);
  userOAuth2Client.setCredentials(tokens);

  const calendar = google.calendar({
    version: "v3",
    auth: userOAuth2Client,
  });

  const events = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  if (!events.data.items) {
    return Response.json({ events: [] });
  }

  const parsedEvents = [];

  for (const event of events.data.items) {
    parsedEvents.push({
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
    });
  }

  const { error: eventError } = await supabase
    .from("calendar_events")
    .insert(parsedEvents);

  const { error: userError } = await supabase
    .from("users")
    .update({ google_calendar_synced_at: new Date() })
    .eq("id", userId);

  const { error: tokenError } = await supabase
    .from("user_tokens")
    .upsert({
      user_id: userId,
      provider: "google",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .eq("user_id", userId);

  if (tokenError) {
    console.error("Error inserting tokens:", tokenError);
  }

  if (eventError) {
    console.error("Error inserting events:", eventError);
  }

  if (userError) {
    console.error("Error updating user:", userError);
  }

  const url = new URL(`/profile`, req.url);
  return NextResponse.redirect(url);
}
