import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MainState } from "../store/store";
import { AnonymousCalendarEvent, CalendarEvent } from "../types/events";
import { addEvents } from "../store/slices/gridSlice";

export const useSync = ({ linkId }: { linkId: string }) => {
  const userId = useSelector((state: MainState) => state.auth.user?.id);
  const dispatch = useDispatch();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const runAutoSync = async () => {
      try {
        setSyncing(true);
        const res = await fetch("/api/supabase/events/auto-sync/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) {
          console.error("Auto-sync failed");
        }

        const { events } = await res.json();

        const linkEvents = events.map(
          (event: CalendarEvent): AnonymousCalendarEvent => {
            const { user_id, ...rest } = event;
            return { ...rest, link_id: linkId };
          },
        );

        const addRes = await fetch("/api/supabase/events/add/link", {
          // add events to link
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ events: linkEvents }),
        });

        if (!addRes.ok) {
          console.error("Failed to add events");
        }

        dispatch(addEvents(linkEvents));
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
  }, [userId]);

  return { syncing };
};
