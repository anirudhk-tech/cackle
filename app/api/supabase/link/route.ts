import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { userId } = await req.json();

  const urlStart = "https://www.cackle.com/";
  const urlEnd = crypto
    .getRandomValues(new Uint8Array(length))
    .map((n) => n % 36)
    .join("");

  const url = urlStart + urlEnd;

  if (!userId) return new Response("Invalid user ID", { status: 400 });

  const { error } = await supabase.from("links").insert({
    user_id: userId,
    link: url,
  });

  if (error) return new Response(error.message, { status: 500 });

  return new Response(JSON.stringify({ link: url }), { status: 200 });
}
