import { configureStore } from "@reduxjs/toolkit";
import snackbarReducer from './features/snackbarSlice';
import { appStateSlice } from "./features/appStateSlice";

export const store = configureStore({
  reducer: {
    appState: appStateSlice.reducer,
    snackbar: snackbarReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;