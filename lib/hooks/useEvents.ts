import { useDispatch, useSelector } from "react-redux";
import { MainState } from "../store/store";
import { setEvents } from "../store/slices/gridSlice";
import { CalendarEvent } from "../types/events";
import { getNext7Days, normalizeEventsForGrid } from "../events";

export const useEvents = () => {
  const events = useSelector((state: MainState) => state.grid.events);
  const dispatch = useDispatch();

  const days = getNext7Days();

  const addEvents = (data: CalendarEvent[]) => {
    const newEvents = normalizeEventsForGrid(data, days[0]);
    const updatedEvents = [...events, ...newEvents];
    dispatch(setEvents(updatedEvents));
  };

  return {
    addEvents,
    events,
  };
};
