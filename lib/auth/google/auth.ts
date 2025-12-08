import { env } from "@/config";
import { google } from "googleapis";

const CLIENT_ID = env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_CALENDAR_SYNC_REDIRECT_URI!;
const ANONYMOUS_REDIRECT_URI =
  process.env.GOOGLE_CALENDAR_ANONYMOUS_SYNC_REDIRECT_URI!;

export const anonymousOAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  ANONYMOUS_REDIRECT_URI,
);

export const getGoogleCalendarSyncUrl = (state: string) => {
  return anonymousOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.readonly"],
    prompt: "consent",
    state,
  });
};
