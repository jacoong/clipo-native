import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '@clipo/core';

type LoginUserInfoState = UserInfo | null;

const initialState: LoginUserInfoState = null;

const loginUserInfoSlice = createSlice({
  name: 'loginUserInfo',
  initialState,
  reducers: {
    setUserInfo: (_state, action: PayloadAction<UserInfo>) => action.payload,
    clearUserInfo: () => null,
  },
});

export const { setUserInfo, clearUserInfo } = loginUserInfoSlice.actions;
export default loginUserInfoSlice.reducer;
