"use client";

import Image from "next/image";
import { useSelector } from "react-redux";
import { MainState } from "@/lib/store/store";
import { tailwindColors } from "@/lib/colors/colors";
import { useAuth } from "@/lib/hooks/useAuth";

export default function ProfilePage() {
  const { handleLogout } = useAuth();
  const user = useSelector((state: MainState) => state.auth.user);
  const userData = useSelector((state: MainState) => state.user.userData);

  const handleGoogleSync = async () => {
    const response = await fetch(
      "/api/supabase/events/sync/google-calendar-sync",
      {
        method: "POST",
        body: JSON.stringify({ userId: user?.id }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to connect Google calendar");
    }

    const { url } = await response.json();
    window.location.href = url;
  };

  const avatarUrl =
    user?.user_metadata?.avatar_url || "/images/avatar-placeholder.png";
  const fullName = user?.user_metadata?.full_name || user?.email || "Anonymous";
  const isGoogleConnected = !!userData?.google_calendar_synced_at;

  return (
    <main
      className={`min-h-screen w-full flex items-center justify-center ${tailwindColors.backgroundLight}`}
    >
      <div className="w-full max-w-md mx-auto rounded-2xl bg-white shadow-lg px-8 py-10 flex flex-col items-center">
        {/* Avatar */}
        <div className="relative w-24 h-24 mb-4">
          <Image
            src={avatarUrl}
            alt="User avatar"
            fill
            className="rounded-full object-cover bg-orange-200"
            sizes="96px"
          />
        </div>

        {/* Name + email */}
        <h1 className={`text-2xl font-semibold ${tailwindColors.text}`}>
          {fullName}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{user?.email}</p>

        {/* Google connection status */}
        <div className="mt-6 w-full">
          <h2 className="text-sm font-medium text-gray-700">
            Google Calendar Status
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex h-2.5 w-2.5 rounded-full ${
                isGoogleConnected ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className="text-sm">
              {isGoogleConnected ? "Connected" : "Not connected"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {isGoogleConnected
              ? "Your Google Calendar events are synced."
              : "Connect Google Calendar to sync your events."}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 w-full">
          {!isGoogleConnected && (
            <button
              type="button"
              className={`w-full px-4 py-2 rounded text-sm font-medium ${tailwindColors.primary} ${tailwindColors.primaryAccent} text-white border ${tailwindColors.border} hover:opacity-90 transition`}
              onClick={handleGoogleSync}
            >
              Connect Google Calendar
            </button>
          )}

          <button
            type="button"
            className="w-full px-4 py-2 rounded text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
