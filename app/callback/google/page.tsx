"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoogleCallbackPage() {
  const router = useRouter();

  const createUser = async () => {
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

      const data = await response.json();

      if (data.error) {
        console.error(data.error);
      } else {
        router.push("/connect");
      }
    }
  };

  useEffect(() => {
    createUser();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Getting you logged in...</p>
    </div>
  );
}
