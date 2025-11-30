import { getRandomUsername } from "@/lib/getRandomUsername";

export async function GET() {
  const username = getRandomUsername();
  return new Response(JSON.stringify({ username }));
}
