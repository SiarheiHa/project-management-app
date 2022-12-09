import { api } from './api';
import { Endpoint, HTTPMethod } from './api.constants';

import { ISignInForm, ISignUpForm, IUserResponse } from '../types/types';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    signInUser: builder.mutation<{ token: string }, ISignInForm>({
      query: (user) => ({
        url: `${Endpoint.AUTH}signin`,
        method: HTTPMethod.POST,
        body: user,
      }),

      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('token', data.token);
          // dispatch(showToast({ message: 'successToSignIn' }));
          //todo remove and change
          // await dispatch(usersApi.endpoints.getUser.initiate(id));
        } catch (error) {}
      },
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    signUpUser: builder.mutation<IUserResponse, ISignUpForm>({
      query: (user) => ({
        url: `${Endpoint.AUTH}signup`,
        method: HTTPMethod.POST,
        body: user,
      }),
      async onQueryStarted({ login, password }, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data._id) {
            await dispatch(authApi.endpoints.signInUser.initiate({ login, password }));
          }
        } catch (error) {}
      },
    }),
  }),
});

export const { useSignInUserMutation, useSignUpUserMutation } = authApi;
