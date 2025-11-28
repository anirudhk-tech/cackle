"use client";

import { Button } from "@/components/ui/button";
import { tailwindColors } from "@/lib/colors/colors";
import { useCheckUser } from "@/lib/hooks/useCheckUser";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useCheckUser();

  return (
    <div
      className={`${tailwindColors.backgroundLight} min-h-screen w-full flex flex-col justify-center items-center px-6`}
    >
      <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-center">
        Stop the endless back-<span className={`${tailwindColors.highlight}`}>and-forth</span>.
      </h1>
      <p className="text-lg sm:text-2xl mb-8 text-center text-gray-700 max-w-xl">
        Cackle syncs your calendars and lets your group pick a time that works for everyone. No accounts needed.
      </p>

      <Button
        className={`${tailwindColors.primary} ${tailwindColors.primaryAccent} text-white px-8 py-4 text-lg`}
        onClick={() => router.push("/link")}
      >
        Get Link, No Login →
      </Button>

      <p className="mt-12 text-sm text-gray-500 text-center max-w-md">
        Works with Google Calendar, Outlook, iCal, and more. Minimal, fast, and
        clean.
      </p>
    </div>
  );
}
