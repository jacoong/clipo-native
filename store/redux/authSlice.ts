import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  isAuthenticated: false,
};

type AuthPayload = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthPayload>) => {
      const { accessToken, refreshToken, expiresAt } = action.payload;
      state.accessToken = accessToken ?? null;
      state.refreshToken = refreshToken ?? null;
      state.expiresAt = expiresAt ?? null;
      state.isAuthenticated = Boolean(accessToken);
    },
    updateTokens: (state, action: PayloadAction<AuthPayload>) => {
      const { accessToken, refreshToken, expiresAt } = action.payload;
      if (accessToken !== undefined) {
        state.accessToken = accessToken;
      }
      if (refreshToken !== undefined) {
        state.refreshToken = refreshToken;
      }
      if (expiresAt !== undefined) {
        state.expiresAt = expiresAt;
      }
      state.isAuthenticated = Boolean(state.accessToken);
    },
    clearAuth: () => initialState,
  },
});

export const { setAuth, updateTokens, clearAuth } = authSlice.actions;
export default authSlice.reducer;
