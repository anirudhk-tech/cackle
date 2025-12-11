import { useDispatch, useSelector } from "react-redux";
import { MainState } from "../store/store";
import { setEvents } from "../store/slices/gridSlice";
import { CalendarEvent } from "../types/events";
import { getNext7Days, normalizeEventsForGrid } from "../events";
import { useEffect } from "react";

export const useEvents = ({ linkId }: { linkId: string }) => {
  const events = useSelector((state: MainState) => state.grid.events);
  const dispatch = useDispatch();

  const days = getNext7Days();

  const handleFillGrid = async () => {
    const response = await fetch(`/api/supabase/events/get/link/${linkId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fill grid");
    }

    const { events } = await response.json();
    addEvents(events);
  };

  const addEvents = (data: CalendarEvent[]) => {
    const newEvents = normalizeEventsForGrid(data, days[0]);
    const updatedEvents = [...events, ...newEvents];
    dispatch(setEvents(updatedEvents));
  };

  useEffect(() => {
    handleFillGrid();
  }, [linkId]);

  return {
    addEvents,
    events,
  };
};
