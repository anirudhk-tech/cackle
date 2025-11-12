import { customSupabaseTheme } from "@/lib/colors/supabaseTheme";
import { supabase } from "@/lib/supabase";
import { Auth } from "@supabase/auth-ui-react";

export const AuthUi = () => (
  <Auth
    providers={["google"]}
    redirectTo={process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_PAGE}
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
);
