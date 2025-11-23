import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type User = { id: string; name: string; email: string; role: "user" | "admin" };

type AuthState = {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
};

const initialState: AuthState = {
  accessToken: null,
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ accessToken: string; user: User }>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    logout(state) {
      state.accessToken = null;
      state.user = null;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
  },
});

export const { loginSuccess, logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
