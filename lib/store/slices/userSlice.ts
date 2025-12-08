import { createSlice } from "@reduxjs/toolkit";

export interface UserSlice {
  userData: {
    id: string | null;
    google_integration: boolean;
  };
}

const initialState: UserSlice = {
  userData: {
    id: null,
    google_integration: false,
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
