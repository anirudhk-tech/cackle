import { useDispatch, useSelector } from "react-redux";
import { MainState } from "../store/store";
import { addEvents } from "../store/slices/gridSlice";
import { useEffect } from "react";

export const useEvents = ({ linkId }: { linkId: string }) => {
  const events = useSelector((state: MainState) => state.grid.events);
  const dispatch = useDispatch();

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
    dispatch(addEvents(events));
  };

  useEffect(() => {
    handleFillGrid();
  }, [linkId]);

  return {
    addEvents,
    events,
  };
};
