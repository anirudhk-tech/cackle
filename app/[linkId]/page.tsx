"use client";

import { AuthUi } from "@/components/ui/authui";
import { tailwindColors } from "@/lib/colors/colors";
import { getRandomUsername } from "@/lib/getRandomUsername";
import { Auth } from "@supabase/auth-ui-react";
import { useParams } from "next/navigation";
import { FaGoogle, FaMicrosoft, FaCalendarAlt } from "react-icons/fa";

export default function GroupLinkPage() {
  const params = useParams();
  const linkId = params.linkId as string;

  return (
    <div className="flex flex-row h-screen w-screen">
      {/* Left blank side */}
      <div className="flex-1"></div>

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
            Without a profile, you'll need to sync calendars each time.
          </p>
        </div>

        {/* Calendar import section */}
        <div className="mt-4 mb-6">
          <div className="flex flex-col gap-3">
            <button
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
            >
              <FaCalendarAlt className="text-orange-500 text-xl" />
              <span className="text-sm">Upload .ics</span>
            </button>
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
