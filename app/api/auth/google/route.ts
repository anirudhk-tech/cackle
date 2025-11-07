import { authUrl } from "@/lib/auth/google/auth";
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ url: authUrl });
}
