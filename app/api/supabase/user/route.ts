import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { accessToken, userMetadata } = await req.json();

  if (!accessToken || !userMetadata) {
    return new Response("Access token or user metadata not found", {
      status: 404,
    });
  }

  const { data, error: userError } = await supabase
    .from("users")
    .upsert(
      {
        email: userMetadata.email,
        name: userMetadata.full_name || null,
        avatar_url: userMetadata.avatar_url || null,
      },
      {
        onConflict: "email",
      },
    )
    .select("*")
    .single();

  if (userError) {
    console.error("Failed to create user:", userError);
    return new Response("Failed to create user", { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
