import { IUserInfo, IUserResponse } from 'types/types';
import { api } from './api';
import { Endpoint, HTTPMethod } from './api.constants';
import { signOutReducer } from '../store/userSlice';

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IUserInfo[], string>({
      query: () => ({
        url: Endpoint.USERS,
      }),
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: 'Users' as const, id })), 'Users'] : ['Users'],
      transformResponse: (users: IUserResponse[]) => {
        return users.map(({ _id, ...rest }) => ({ ...rest, id: _id }));
      },
    }),

    getUser: builder.query<IUserInfo, string>({
      query: (id) => ({
        url: `${Endpoint.USERS}${id}`,
      }),
      providesTags: (result) => (result ? [{ type: 'Users' as const, id: result.id }] : ['Users']),
      transformResponse: ({ _id, ...rest }: IUserResponse) => {
        return { ...rest, id: _id };
      },
    }),

    setUserInfo: builder.mutation<IUserResponse, IUserInfo>({
      query: ({ id, ...user }) => ({
        url: `${Endpoint.USERS}${id}`,
        method: HTTPMethod.PUT,
        body: user,
      }),
      // invalidatesTags: [{ type: 'Users', id: 'LIST' }], //todo optimistic query

      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData('getUser', id, (draft) => {
            //need to understand why not updates the state
            //it's should work, if we find the way get rid of user state or do really sync of state and cache.
            Object.assign(draft, patch);
          })
        );
        try {
          await queryFulfilled;
          // dispatch();
        } catch {
          patchResult.undo();
          /**
           * Alternatively, on failure you can invalidate the corresponding cache tags
           * to trigger a re-fetch:
           * dispatch(api.util.invalidateTags(['Post']))
           */
        }
      },
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${Endpoint.USERS}${id}`,
        method: HTTPMethod.DELETE,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(api.util.resetApiState());
            dispatch(signOutReducer());
          }
        } catch {}
      },
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery, useDeleteUserMutation, useSetUserInfoMutation } =
  usersApi;
