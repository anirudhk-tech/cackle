"use client";

import { AuthUi } from "@/components/ui/authui";

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
        <AuthUi />
      </div>
    </div>
  );
}
