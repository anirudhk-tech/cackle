import { expandIcsForRange, getNext7Days } from "@/lib/events";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { icsText, linkId } = await request.json();
  const days = getNext7Days();
  const weekStart = days[0];
  const weekEnd = new Date(
    days[6].getFullYear(),
    days[6].getMonth(),
    days[6].getDate(),
    23,
    59,
    59,
  );

  const parsedEvents = expandIcsForRange(icsText, weekStart, weekEnd, linkId);

  const { error } = await supabase
    .from("anonymous_calendar_events")
    .insert(parsedEvents);

  if (error) {
    console.error("Error inserting events:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ events: parsedEvents }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
