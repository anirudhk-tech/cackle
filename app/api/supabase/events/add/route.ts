import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { events } = body;

  const { error } = await supabase.from("calendar_events").insert(events);

  if (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Events added successfully" },
    { status: 200 },
  );
}
