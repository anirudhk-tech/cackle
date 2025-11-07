"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GoogleCalendarIcon,
  OtherCalendarIcon,
  OutlookCalendarIcon,
} from "@/lib/customIcons";

const onGoogleLogin = async () => {
  const response = await fetch("/api/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error("Failed to connect Google calendar");
  }

  const { url } = await response.json();
  window.location.href = url;
};

export default function ConnectCalendarsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Where are your calendars?</CardTitle>
            <CardDescription>Choose what you want to connect.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                key={"google"}
                variant="outline"
                className="w-full h-14 flex items-center justify-between px-4 rounded-lg"
                onClick={onGoogleLogin}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-white shadow-sm">
                    <p aria-hidden>
                      <p>
                        <GoogleCalendarIcon />
                      </p>
                    </p>
                    <p style={{ marginTop: -36 }} />
                  </div>

                  <div className="text-left">
                    <div className="text-sm text-slate-900">
                      Google Calendar
                    </div>
                    <div className="text-xs text-slate-500">Google</div>
                  </div>
                </div>
              </Button>
              <Button
                key={"outlook"}
                variant="outline"
                className="w-full h-14 flex items-center justify-between px-4 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-white shadow-sm">
                    <p aria-hidden>
                      <p>
                        <OutlookCalendarIcon />
                      </p>
                    </p>
                    <p style={{ marginTop: -36 }} />
                  </div>

                  <div className="text-left">
                    <div className="text-sm text-slate-900">
                      Outlook Calendar
                    </div>
                    <div className="text-xs text-slate-500">Microsoft</div>
                  </div>
                </div>
              </Button>
              <Button
                key={"manual"}
                variant="outline"
                className="w-full h-14 flex items-center justify-between px-4 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-white shadow-sm">
                    <p aria-hidden>
                      <p>
                        <OutlookCalendarIcon />
                      </p>
                    </p>
                    <p style={{ marginTop: -36 }} />
                  </div>

                  <div className="text-left">
                    <div className="text-sm text-slate-900">Manual Import</div>
                    <div className="text-xs text-slate-500">
                      Restricted or unable to sync
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
