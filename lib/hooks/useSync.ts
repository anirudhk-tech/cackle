import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MainState } from "../store/store";

export const useSync = () => {
  const user = useSelector((state: MainState) => state.auth.user);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    console.log("User:", user);
    let cancelled = false;

    const runAutoSync = async () => {
      try {
        setSyncing(true);
        const res = await fetch("/api/supabase/events/auto-sync/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!res.ok) {
          console.error("Auto-sync failed");
        }
      } catch (e) {
        console.error("Auto-sync error", e);
      } finally {
        if (!cancelled) setSyncing(false);
      }
    };

    runAutoSync();

    return () => {
      cancelled = true;
    };
  }, [user?.id, user]);

  return { syncing };
};
