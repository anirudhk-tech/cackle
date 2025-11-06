import { env } from "@/config";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

const CLIENT_ID = env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

export const listEvents = async (credential: string) => {
  const { tokens } = await OAuth2Client.getToken(credential);
};
