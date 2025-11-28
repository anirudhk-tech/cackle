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
    clearEvents: (state) => {
      state.events = [];
    },
  },
});

export const { setEvents, clearEvents } = gridSlice.actions;
export default gridSlice.reducer;
