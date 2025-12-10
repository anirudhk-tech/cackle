"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const createUser = useCallback(async () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      return;
    }

    if (accessToken && user) {
      const response = await fetch("/api/supabase/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken, user }),
      });

      if (!response.ok) {
        console.error("Failed to create user");
        return;
      }

      router.push("/profile");
    }
  }, [router]);

  useEffect(() => {
    createUser();
  }, [createUser]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Getting you logged in...</p>
    </div>
  );
}
