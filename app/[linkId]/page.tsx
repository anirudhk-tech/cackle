"use client";

import MainGrid from "@/components/grid/main-grid";
import { tailwindColors } from "@/lib/colors/colors";
import { useAuth } from "@/lib/hooks/useAuth";
import { useEvents } from "@/lib/hooks/useEvents";
import { useSync } from "@/lib/hooks/useSync";
import { MainState } from "@/lib/store/store";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaGoogle, FaCalendarAlt } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function GroupLinkPage() {
  const params = useParams<{ linkId: string }>();
  const [username, setUsername] = useState<string | null>(null);
  const { addEvents } = useEvents();
  const { handleLogin, handleLogout } = useAuth();
  const user = useSelector((state: MainState) => state.auth.user);
  const userData = useSelector((state: MainState) => state.user.userData);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { handleGoogleSync } = useSync();

  const handleManualSync = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFillGrid = async () => {
    const response = await fetch("/api/supabase/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ linkId: params.linkId }),
    });

    if (!response.ok) {
      throw new Error("Failed to fill grid");
    }

    const { events } = await response.json();
    addEvents(events);
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
          body: JSON.stringify({
            linkId: params.linkId,
            icsText: text,
          }),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to sync ICS file");
            }
            return res.json();
          })
          .then(async (data) => {
            addEvents(data.events);
            await fetch("/api/supabase/events/add", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ events: data.events }),
            });
          })
          .catch((error) => {
            console.error("Error syncing ICS file:", error);
          });
      }
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    const setRandomUsername = async () => {
      const response = await fetch("api/user/random-username", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate random username");
      }

      const data = await response.json();
      setUsername(data.username);
    };

    setRandomUsername();
    handleFillGrid();
  }, []);

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
          {user ? (
            <Image
              className="rounded-full bg-orange-200"
              width={50}
              height={50}
              src={user.user_metadata.avatar_url}
              alt="User Avatar"
            />
          ) : null}
          <span className={`font-semibold text-xl ${tailwindColors.text}`}>
            {user ? user.user_metadata.full_name : username}
          </span>
        </div>

        {!user ? (
          <>
            <h2 className={`text-xl font-bold mb-2 ${tailwindColors.text}`}>
              Sync your calendars
            </h2>
            <div className="mb-2">
              <p className="text-sm text-gray-500">
                {`Without a profile, you'll need to sync calendars each time.`}
              </p>
            </div>

            <div className="mt-4 mb-6">
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleGoogleSync(params.linkId)}
                  className={`flex items-center gap-2 px-4 py-2 rounded bg-white border ${tailwindColors.border} text-gray-700 hover:bg-orange-100 transition`}
                  aria-label="Sync with Google Calendar"
                >
                  <FaGoogle className="text-orange-500 text-xl" />
                  <span className="text-sm">Sync with Google</span>
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

            <div className="grow flex flex-col justify-start mt-5">
              <button
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded ${tailwindColors.primary} ${tailwindColors.primaryAccent} text-white border ${tailwindColors.border} transition`}
                aria-label="Login"
                onClick={handleLogin}
              >
                <span className="text-sm">Login</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col">
            <span className="text-sm">
              {userData.google_integration
                ? "You have google calendar synced!"
                : "You have not synced with google."}
            </span>

            {!userData.google_integration && (
              <div className="grow flex flex-col justify-start mt-5">
                <button
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded ${tailwindColors.primary} ${tailwindColors.primaryAccent} text-white border ${tailwindColors.border} transition`}
                  aria-label="Sync with Google Calendar"
                  onClick={() => handleGoogleSync(params.linkId)}
                >
                  <span className="text-sm">Sync with Google Calendar</span>
                </button>
              </div>
            )}
            <div className="grow flex flex-col justify-start mt-5">
              <button
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded ${tailwindColors.primary} ${tailwindColors.primaryAccent} text-white border ${tailwindColors.border} transition`}
                aria-label="Logout"
                onClick={handleLogout}
              >
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
