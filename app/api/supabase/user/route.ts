import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { accessToken, user } = await req.json();

  if (!accessToken || !user) {
    return new Response("Access token or user metadata not found", {
      status: 404,
    });
  }

  const { data, error: userError } = await supabase
    .from("users")
    .upsert(
      {
        id: user.id,
        email: user.user_metadata.email,
        name: user.user_metadata.full_name || null,
        avatar_url: user.user_metadata.avatar_url || null,
      },
      {
        onConflict: "email",
      },
    )
    .select("*")
    .single();

  if (userError) {
    console.error("Failed to create user:", userError);
    return new Response(JSON.stringify({ error: "Failed to create user" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
