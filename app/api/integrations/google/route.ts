import { listEvents } from "@/lib/integrations/google/calendar";

export async function POST(req: Request) {
  const body = await req.json();
  const { credential } = body;

  return new Response(
    JSON.stringify({
      message: "Events fetched successfully",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
