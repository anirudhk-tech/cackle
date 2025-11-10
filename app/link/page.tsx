"use client";

import { useSelector } from "react-redux";

import { tailwindColors } from "@/lib/colors/colors";
import { MainState } from "@/lib/store/store";
import { useEffect, useState } from "react";

export default function LinkPage() {
  const [link, setLink] = useState("");
  const user = useSelector((state: MainState) => state.auth.user);

  const fetchLink = async () => {
    if (!user) {
      console.log("User not found");
      return;
    }

    const response = await fetch("/api/supabase/link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.id }),
    });

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
      return;
    }

    console.log(data);

    setLink(data.link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    alert("Link copied! Share it with your friends.");
  };

  useEffect(() => {
    if (!user) {
      console.log("User not found");
      return;
    }
    fetchLink();
  }, [user]);

  return (
    <div
      className={`${tailwindColors.backgroundLight} min-h-screen flex flex-col justify-center items-center px-6`}
    >
      <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-center text-gray-900">
        Share This Link
      </h1>
      <p className="text-lg sm:text-2xl mb-8 text-center text-gray-700 max-w-xl">
        Copy the link below and send it to your friends!
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={link}
          disabled
          className="px-4 py-3 w-96 rounded-md border border-gray-300 text-gray-900 focus:outline-none bg-gray-100"
        />
        <button
          onClick={copyToClipboard}
          className={`px-6 py-3 rounded-md ${tailwindColors.primary} ${tailwindColors.primaryAccent} ${tailwindColors.buttonText}`}
        >
          Copy
        </button>
      </div>

      <p className="mt-12 text-sm text-gray-500 text-center max-w-md">
        Works on all devices. Fast, minimal, and clean.
      </p>
    </div>
  );
}
