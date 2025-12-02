import { expandIcsForRange, getNext7Days } from "@/lib/events";

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

  return new Response(JSON.stringify({ events: parsedEvents }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
