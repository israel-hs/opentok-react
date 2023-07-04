import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface OpentokCredentialsState {
  sessionId: string | null;
  token: string | null;
}

const initialState: OpentokCredentialsState = {
  sessionId: null,
  token: null,
};

export const opentokCredentialsSlice = createSlice({
  name: "opentokCredentials",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ sessionId: string; token: string }>
    ) => {
      state.sessionId = action.payload.sessionId;
      state.token = action.payload.token;
    },
  },
});

export const { setCredentials } = opentokCredentialsSlice.actions;
export default opentokCredentialsSlice.reducer;
