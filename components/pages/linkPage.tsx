import { useAuth } from "@/lib/hooks/useAuth";
import { useEvents } from "@/lib/hooks/useEvents";
import { MainState } from "@/lib/store/store";
import { useRef } from "react";
import { useSelector } from "react-redux";
import MainGrid from "../grid/main-grid";
import { tailwindColors } from "@/lib/colors/colors";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { FaCalendarAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function LinkPage({ linkId }: { linkId: string }) {
  const { addEvents } = useEvents({ linkId });
  const { handleLogout } = useAuth();
  const user = useSelector((state: MainState) => state.auth.user) as User;
  const userData = useSelector((state: MainState) => state.user.userData);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

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
        fetch("/api/supabase/events/sync/ics-sync", {
          method: "POST",
          headers: {
            "Content-Type": "text/calendar",
          },
          body: JSON.stringify({
            userId: userData ? userData.id : null,
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
          <Image
            className="rounded-full bg-orange-200"
            width={50}
            height={50}
            src={user.user_metadata.avatar_url}
            alt="User Avatar"
          />
          <span className={`font-semibold text-xl ${tailwindColors.text}`}>
            {user.user_metadata.full_name}
          </span>
        </div>

        <div className="flex flex-col">
          <button
            className={`flex items-center gap-2 mt-2 px-4 py-2 rounded bg-white border ${tailwindColors.border} text-gray-700 hover:bg-orange-100 transition`}
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

          {!userData.google_calendar_synced_at && (
            <div className="grow flex flex-col justify-start mt-5">
              <button
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded ${tailwindColors.primary} ${tailwindColors.primaryAccent} text-white border ${tailwindColors.border} transition`}
                aria-label="Sync with Google Calendar"
                onClick={() => router.push("/profile")}
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
      </div>
    </div>
  );
}
