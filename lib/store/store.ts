import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/authSlice";
import { gridSlice } from "./slices/gridSlice";

const rootReducer = combineSlices(authSlice, gridSlice);

export type MainState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat();
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
