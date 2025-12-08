import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("link_id", id);

  if (error) {
    console.error(error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  if (!data || data.length === 0) {
    return new Response(JSON.stringify({ error: "Event not found" }), {
      status: 404,
    });
  }

  return NextResponse.json({ events: data }, { status: 200 });
}
