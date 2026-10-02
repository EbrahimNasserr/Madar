import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  initialized: boolean;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user?: User;
        accessToken?: string;
        refreshToken?: string;
      }>
    ) => {
      if (action.payload.user) {
        state.user = action.payload.user;
      }
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
      }
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },

    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, setInitialized, logout } =
  authSlice.actions;

export default authSlice.reducer;
