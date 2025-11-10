"use client";

import { Button } from "@/components/ui/button";
import { tailwindColors } from "@/lib/colors/colors";
import { setUser } from "@/lib/store/slices/authSlice";
import { MainState } from "@/lib/store/store";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      dispatch(setUser(session?.user || null));

      if (!session) {
        router.push("/auth");
      }
    };
    checkUser();
  }, []);

  return (
    <div
      className={`${tailwindColors.backgroundLight} min-h-screen flex flex-col justify-center items-center px-6`}
    >
      <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-center">
        Stop the endless back-and-forth
      </h1>
      <p className="text-lg sm:text-2xl mb-8 text-center text-gray-700 max-w-xl">
        Cackle syncs your calendars and lets your group pick a time in seconds.
      </p>

      <Button
        className={`${tailwindColors.primary} ${tailwindColors.primaryAccent} text-white px-8 py-4 text-lg`}
        onClick={() => router.push("/link")}
      >
        Create Your Free Cackle Link →
      </Button>

      <p className="mt-12 text-sm text-gray-500 text-center max-w-md">
        Works with Google Calendar, Outlook, iCal, and more. Minimal, fast, and
        clean.
      </p>
    </div>
  );
}
