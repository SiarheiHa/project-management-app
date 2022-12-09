import { useMemo } from 'react';
import { selectUserID } from '../store/userSlice';
import { useAppSelector } from '../store/redux.hooks';
import { IUserInfo } from '../types/types';
import { useGetUserQuery } from '../services/users.api';

export interface LoggedInUser extends IUserInfo {
  loggedIn: true;
  isLoading: boolean;
}

interface NotLoggedInUser extends IUserInfo {
  loggedIn: false;
  isLoading: boolean;
  name: '';
  login: '';
  id: '';
}

export type User = LoggedInUser | NotLoggedInUser;

export const useCurrentUser = (): User => {
  const id = useAppSelector(selectUserID);
  const { isLoading, data: user } = useGetUserQuery(id, { skip: id.length === 0 });
  if (user) {
    return { isLoading, loggedIn: true, ...user };
  } else {
    return { isLoading, loggedIn: false, name: '', login: '', id: '' };
  }
};
