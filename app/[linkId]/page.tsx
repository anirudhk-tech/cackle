"use client";

import MainGrid from "@/components/grid/main-grid";
import { tailwindColors } from "@/lib/colors/colors";
import { getRandomUsername } from "@/lib/getRandomUsername";
import { useEvents } from "@/lib/hooks/useEvents";
import { useRef } from "react";
import { FaGoogle, FaMicrosoft, FaCalendarAlt } from "react-icons/fa";

export default function GroupLinkPage() {
  const { addEvents } = useEvents();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleGoogleSync = async () => {
    const response = await fetch("/api/sync/google-calendar-sync", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to connect Google calendar");
    }

    const { url } = await response.json();
    window.location.href = url;
  };

  const handleManualSync = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        fetch("/api/sync/ics-sync", {
          method: "POST",
          headers: {
            "Content-Type": "text/calendar",
          },
          body: text,
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to sync ICS file");
            }
            return res.json();
          })
          .then((data) => {
            addEvents(data.events);
          })
          .catch((error) => {
            console.error("Error syncing ICS file:", error);
          });
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex flex-row h-screen w-screen">
      {/* Left blank side */}
      <div className="flex-1">
        <MainGrid />
      </div>

      {/* Right sidebar */}
      <div
        className={`border-l w-72 flex flex-col p-6 ${tailwindColors.backgroundLight}`}
        style={{
          borderColor: "#f97316", // orange-500 hex
        }}
      >
        {/* Profile section */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-orange-200"></div>
          <span className={`font-semibold text-xl ${tailwindColors.text}`}>
            {getRandomUsername()}
          </span>
        </div>

        {/* Import calendars heading */}
        <h2 className={`text-xl font-bold mb-2 ${tailwindColors.text}`}>
          Sync your calendars
        </h2>
        <div className="mb-2">
          <p className="text-sm text-gray-500">
            {`Without a profile, you'll need to sync calendars each time.`}
          </p>
        </div>

        {/* Calendar import section */}
        <div className="mt-4 mb-6">
          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoogleSync}
              className={`flex items-center gap-2 px-4 py-2 rounded bg-white border ${tailwindColors.border} text-gray-700 hover:bg-orange-100 transition`}
              aria-label="Sync with Google Calendar"
            >
              <FaGoogle className="text-orange-500 text-xl" />
              <span className="text-sm">Sync with Google</span>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded bg-white border ${tailwindColors.border} text-gray-700 hover:bg-orange-100 transition`}
              aria-label="Sync with Outlook"
            >
              <FaMicrosoft className="text-orange-500 text-xl" />
              <span className="text-sm">Sync with Outlook</span>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded bg-white border ${tailwindColors.border} text-gray-700 hover:bg-orange-100 transition`}
              aria-label="Manual Calendar Import"
              onClick={handleManualSync}
            >
              <FaCalendarAlt className="text-orange-500 text-xl" />
              <span className="text-sm">Upload .ics</span>
            </button>
            <input
              type="file"
              accept=".ics"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Divider with "Or" */}
        <div className="flex items-center my-4">
          <div className={`grow border-b ${tailwindColors.border}`}></div>
          <span className="mx-2 text-gray-500 text-sm">Or</span>
          <div className={`grow border-b ${tailwindColors.border}`}></div>
        </div>

        <h2 className={`text-xl font-bold mb-2 ${tailwindColors.text}`}>
          Create a profile
        </h2>
        <p className="text-sm text-gray-500">
          All your calendars sync automatically for every link.
        </p>

        {/* Login button */}
        <div className="grow flex flex-col justify-start mt-5">
          <button
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded ${tailwindColors.primary} ${tailwindColors.primaryAccent} text-white border ${tailwindColors.border} transition`}
            aria-label="Login"
          >
            <span className="text-sm">Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
