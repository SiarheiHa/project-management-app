import { api } from './api';
import { IColumn, ITask } from 'types/types';
import { Endpoint, HTTPMethod } from './api.constants';

export const boardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<ITask[], string>({
      query: (columnsIdList) => ({
        url: `${Endpoint.TASKS_SET}?ids=${columnsIdList}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Tasks' as const, _id })),
              { type: 'Tasks', id: 'LIST' },
            ]
          : [{ type: 'Tasks', id: 'LIST' }],
    }),

    /*getTasksByColumn: builder.query<ITask[], { boardId: string; columnId: string }>({
      query: ({ boardId, columnId }) => ({
        url: `${Endpoint.BOARDS}${boardId}/columns/${columnId}/tasks`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Tasks' as const, _id })),
              { type: 'Tasks', id: 'LIST' },
            ]
          : [{ type: 'Tasks', id: 'LIST' }],
    }),
    getTasksSetByColumnIds: builder.query<ITask[], string>({
      query: (columnsIdList) => ({
        url: `${Endpoint.TASKS_SET}?ids=${columnsIdList}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Tasks' as const, _id })),
              { type: 'Tasks', id: 'LIST' },
            ]
          : [{ type: 'Tasks', id: 'LIST' }],
    }),*/
    getTasksByBoardId: builder.query<ITask[], string>({
      query: (boardId) => ({
        url: `${Endpoint.TASKS_SET}/${boardId}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Tasks' as const, _id })),
              { type: 'Tasks', id: 'LIST' },
            ]
          : [{ type: 'Tasks', id: 'LIST' }],
    }),
    getTasksSetBySearch: builder.query<ITask[], { userId: string; searchString: string }>({
      query: ({ userId, searchString }) => {
        if (searchString) {
          return {
            url: `${Endpoint.TASKS_SET}?search=${searchString}`,
          };
        }
        return {
          url: `${Endpoint.TASKS_SET}?userId=${userId}`,
        };
      },
      providesTags: ['Search'],
    }),
    updateTasksSet: builder.mutation<
      ITask[],
      { set: Pick<ITask, '_id' | 'order' | 'columnId'>[]; boardId: string }
    >({
      query: ({ set, boardId }) => ({
        url: Endpoint.TASKS_SET,
        method: HTTPMethod.PATCH,
        body: set,
      }),

      async onQueryStarted({ boardId, set }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          boardApi.util.updateQueryData('getTasksByBoardId', boardId, (draft) => {
            const newArr = draft.map((item) => {
              const task = set.find((newTask) => {
                if (newTask._id === item._id) {
                  return item;
                } else {
                  return false;
                }
              });
              if (task) {
                item.order = task.order;
                item.columnId = task?.columnId;
                return item;
              } else {
                return item;
              }
            });
            Object.assign(draft, newArr);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
    }),
    addTask: builder.mutation<ITask, Omit<ITask, '_id'>>({
      query: ({ boardId, columnId, ...rest }) => ({
        url: `${Endpoint.BOARDS}${boardId}/columns/${columnId}/tasks`,
        method: HTTPMethod.POST,
        body: { ...rest },
      }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }, 'Search'],
    }),
    updateTask: builder.mutation<ITask, ITask>({
      query: ({ boardId, columnId, _id, ...rest }) => ({
        url: `${Endpoint.BOARDS}${boardId}/columns/${columnId}/tasks/${_id}`,
        method: HTTPMethod.PUT,
        body: { columnId: columnId, ...rest },
      }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }, 'Search'],
    }),
    deleteTask: builder.mutation<
      ITask,
      Omit<ITask, 'title' | 'order' | 'description' | 'userId' | 'users'>
    >({
      query: ({ boardId, columnId, _id }) => ({
        url: `${Endpoint.BOARDS}${boardId}/columns/${columnId}/tasks/${_id}`,
        method: HTTPMethod.DELETE,
      }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }, 'Search'],
    }),
    getColumns: builder.query<IColumn[], string>({
      query: (boardId) => ({
        url: `${Endpoint.BOARDS}${boardId}/columns`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Columns' as const, _id })),
              { type: 'Columns', id: 'LIST' },
            ]
          : [{ type: 'Columns', id: 'LIST' }],
    }),
    updateColumnsSet: builder.mutation<
      IColumn[],
      { set: Pick<IColumn, '_id' | 'order'>[]; boardId: string }
    >({
      query: ({ set, boardId }) => ({
        url: Endpoint.COLUMNS_SET,
        method: HTTPMethod.PATCH,
        body: set,
      }),
      async onQueryStarted({ boardId, set }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          boardApi.util.updateQueryData('getColumns', boardId, (draft) => {
            const newArr = draft
              .map((item) => {
                const column = set.find((newColumn) => {
                  if (newColumn._id === item._id) {
                    return item;
                  } else {
                    return false;
                  }
                });
                if (column) {
                  item.order = column.order;
                  return item;
                } else {
                  return item;
                }
              })
              .sort((a, b) => {
                if (a.order > b.order) {
                  return 1;
                } else {
                  return -1;
                }
              });

            Object.assign(draft, newArr);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: 'Columns', id: 'LIST' }],
    }),
    addColumn: builder.mutation<IColumn, Omit<IColumn, '_id'>>({
      query: ({ boardId, ...rest }) => ({
        url: `${Endpoint.BOARDS}${boardId}/${Endpoint.COLUMNS}`,
        method: HTTPMethod.POST,
        body: { ...rest },
      }),
      invalidatesTags: [{ type: 'Columns', id: 'LIST' }],
    }),
    deleteColumn: builder.mutation<IColumn, Pick<IColumn, 'boardId' | '_id'>>({
      query: ({ boardId, _id }) => ({
        url: `${Endpoint.BOARDS}${boardId}/${Endpoint.COLUMNS}${_id}`,
        method: HTTPMethod.DELETE,
      }),
      invalidatesTags: [{ type: 'Columns', id: 'LIST' }],
    }),
    updateColumn: builder.mutation<IColumn, Omit<IColumn, 'boardId'>>({
      query: (columnData) => ({
        url: `${Endpoint.BOARDS}${columnData._id}/${Endpoint.COLUMNS}${columnData._id}`,
        method: HTTPMethod.PUT,
        body: { title: columnData.title, order: columnData.order },
      }),
      invalidatesTags: [{ type: 'Columns', id: 'LIST' }],
    }),
  }),
});

export const {
  useAddColumnMutation,
  useDeleteColumnMutation,
  useGetColumnsQuery,
  useUpdateColumnMutation,
  useUpdateColumnsSetMutation,
  useGetTasksQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useGetTasksByBoardIdQuery,
  useUpdateTaskMutation,
  useUpdateTasksSetMutation,
  useGetTasksSetBySearchQuery,
} = boardApi;
