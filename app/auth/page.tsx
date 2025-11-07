"use client";

import { customSupabaseTheme } from "@/lib/colors/supabaseTheme";
import { supabase } from "@/lib/supabase";
import { Auth } from "@supabase/auth-ui-react";

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
        <Auth
          providers={["google"]}
          supabaseClient={supabase}
          appearance={{
            theme: customSupabaseTheme,
            style: {
              input: {
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 5,
                paddingBottom: 5,
              },
              button: {
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 5,
                paddingBottom: 5,
              },
            },
          }}
        />
      </div>
    </div>
  );
}
