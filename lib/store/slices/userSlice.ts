import { createSlice } from "@reduxjs/toolkit";

export interface UserSlice {
  userData: {
    id: string | null;
    google_calendar_synced_at: Date | null;
  };
}

const initialState: UserSlice = {
  userData: {
    id: null,
    google_calendar_synced_at: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
