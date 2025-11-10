import { createSlice } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";

export interface AuthSlice {
  user: User | null;
}

const initialState: AuthSlice = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state: AuthSlice, action: { payload: User | null }) {
      state.user = action.payload;
    },
    clearUser(state: AuthSlice) {
      state.user = null;
    },
    updateUser(state: AuthSlice, action: { payload: Partial<User> }) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setUser, clearUser, updateUser } = authSlice.actions;
export default authSlice.reducer;
