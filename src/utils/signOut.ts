import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { signOutReducer } from '../store/userSlice';

export const signOut = (dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => {
  localStorage.removeItem('token');
  dispatch(signOutReducer());
  dispatch(api.util.resetApiState());
};
