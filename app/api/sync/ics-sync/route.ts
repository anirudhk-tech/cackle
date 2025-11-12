import ical from "node-ical";

export async function POST(request: Request) {
  const icsText = await request.text();

  const events = ical.parseICS(icsText);
  const parsedEvents = [];

  for (const key in events) {
    const event = events[key];
    if (event.type === "VEVENT") {
      let recurringEventId = null;

      if (event.rrule) {
        recurringEventId = event.rrule.toString();
      }

      parsedEvents.push({
        id: event.uid,
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: event.start.toISOString
          ? event.start.toISOString()
          : event.start,
        end: event.end.toISOString ? event.end.toISOString() : event.end,
        recurringEventId,
        originalStartTime: null,
        timeZone: null,
      });
    }
  }

  console.log("Parsed events:", parsedEvents);

  return new Response(JSON.stringify({ events: parsedEvents }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
