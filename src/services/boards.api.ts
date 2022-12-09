import { Board } from 'types/types';
import { api } from './api';
import { Endpoint, HTTPMethod } from './api.constants';

export const boardsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBoardsSetByUserId: builder.query<Board[], string>({
      query: (id) => ({
        url: `${Endpoint.BOARDS_SET}${id}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Boards' as const, _id })),
              { type: 'Boards', id: 'LIST' },
            ]
          : [{ type: 'Boards', id: 'LIST' }],
    }),
    getBoardById: builder.query<Board, string>({
      query: (id) => ({
        url: `${Endpoint.BOARDS}${id}`,
      }),
      providesTags: ['Board'],
    }),
    deleteBoard: builder.mutation<Board, string>({
      query: (id) => ({
        url: `${Endpoint.BOARDS}${id}`,
        method: HTTPMethod.DELETE,
      }),
      invalidatesTags: [{ type: 'Boards', id: 'LIST' }, 'Board'],
    }),
    createBoard: builder.mutation<Board, Omit<Board, '_id'>>({
      query: (boardData) => ({
        url: `${Endpoint.BOARDS}`,
        method: HTTPMethod.POST,
        body: { ...boardData },
      }),
      invalidatesTags: [{ type: 'Boards', id: 'LIST' }],
    }),
    updateBoard: builder.mutation<Board, Board>({
      query: ({ _id, ...rest }) => ({
        url: `${Endpoint.BOARDS}${_id}`,
        method: HTTPMethod.PUT,
        body: rest,
      }),
      invalidatesTags: [{ type: 'Boards', id: 'LIST' }, 'Board'],
    }),
  }),
});

export const {
  useGetBoardsSetByUserIdQuery,
  useDeleteBoardMutation,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useGetBoardByIdQuery,
} = boardsApi;
