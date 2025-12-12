import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const UUID_LENGTH = 8;
  const { userId } = await req.json();

  const urlStart = process.env.NEXT_PUBLIC_DOMAIN_BASE;
  const arr = Array.from(crypto.getRandomValues(new Uint8Array(UUID_LENGTH)));
  const urlEnd = arr.map((n) => (n % 36).toString(36)).join("");

  const url = urlStart + urlEnd;

  const { error } = await supabase.from("links").insert({
    id: urlEnd,
    user_id: userId ?? null,
    link: url,
  });

  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });

  return new Response(JSON.stringify({ link: url }), { status: 200 });
}
