import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from 'firebase/auth';

type UserState = UserInfo | null;
const initialState = null as UserState;

export const slice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset: () => initialState,
    setUser: (state, action: PayloadAction<UserInfo>) => action.payload,
  },
});

export const actions = { ...slice.actions };
export default slice.reducer;
