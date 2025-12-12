import { getNext7Days, normalizeEventsForGrid } from "@/lib/events";
import { GridEvent } from "@/lib/types/events";
import { createSlice } from "@reduxjs/toolkit";

export interface GridSlice {
  events: GridEvent[];
}

const initialState: GridSlice = {
  events: [],
};

export const gridSlice = createSlice({
  name: "grid",
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    addEvents: (state, action) => {
      const days = getNext7Days();
      const newEvents = normalizeEventsForGrid(action.payload, days[0]);
      const newEventsMap = new Map(
        newEvents.map((event) => [event.external_id, event]),
      );
      state.events = [
        ...newEvents,
        ...state.events.filter(
          (event) => event.external_id && !newEventsMap.has(event.external_id),
        ),
      ];
    },
    clearEvents: (state) => {
      state.events = [];
    },
  },
});

export const { setEvents, clearEvents, addEvents } = gridSlice.actions;
export default gridSlice.reducer;
