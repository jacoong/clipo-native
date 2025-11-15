import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import loginUserInfoReducer from './loginUserInfoSlice';
import modalReducer from './modalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loginUserInfo: loginUserInfoReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Modal props store callback references (e.g. button handlers),
      // so we disable the serializable check for this app-wide store.
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
