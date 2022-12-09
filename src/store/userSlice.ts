import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from './store';

import { authApi } from '../services/auth.api';
import { DecodedToken } from '../types/types';
import jwt_decode from 'jwt-decode';
import { signOut } from '../utils/signOut';

interface UserState {
  token: string;
}
export const defaultUserState: UserState = {
  token: '',
};

export const signOutAction = createAsyncThunk('user/signOut', async (_, { dispatch }) => {
  signOut(dispatch);
});

export const userSlice = createSlice({
  name: 'user',
  initialState: defaultUserState,
  reducers: {
    signOutReducer: () => {
      return defaultUserState;
    },
    setToken: (state: UserState, action: PayloadAction<UserState['token']>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.signInUser.matchFulfilled,
      (state, { payload: { token } }) => {
        state.token = token;
      }
    );
  },
});

export const { signOutReducer } = userSlice.actions;
export default userSlice.reducer;

export const selectUserID = (state: RootState) =>
  state.user.token ? (jwt_decode(state.user.token) as DecodedToken).id : '';
