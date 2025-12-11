import { supabase } from "@/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  const user = await supabase.from("users").select("*").eq("id", id).single();

  if (user.error) {
    console.error("Failed to fetch user:", user.error);
    return new Response(JSON.stringify({ error: "Failed to fetch user" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(user.data), {
    status: 200,
  });
}
