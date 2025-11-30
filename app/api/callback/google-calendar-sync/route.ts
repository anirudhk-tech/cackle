import { oAuth2Client } from "@/lib/auth/google/auth";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const linkId = searchParams.get("state");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
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
      id: event.iCalUID || event.id,
      summary: event.summary,
      description: event.description,
      location: event.location,
      start: event.start?.dateTime || event.start,
      end: event.end?.dateTime || event.end,
      recurringEventId: event.recurringEventId || null,
      originalStartTime: event.originalStartTime?.dateTime || null,
      timeZone: event.start?.timeZone || null,
    });
  }

  const res = NextResponse.redirect(new URL(`/${linkId}`, req.url));

  res.cookies.set("events_payload", JSON.stringify(parsedEvents), {
    httpOnly: false,
    maxAge: 60,
    path: "/",
    sameSite: "lax",
  });

  return res;
}
