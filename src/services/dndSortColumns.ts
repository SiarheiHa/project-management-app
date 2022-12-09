import { DragSourceMonitor } from 'react-dnd';
import { IColumn, ITask } from '../types/types';

//todo: refactor: add to onDeleteTask
export const getTasksAfterDelTask = (dataTasks: ITask[], removeTask: ITask) => {
  return dataTasks
    .filter((task) => task._id !== removeTask._id)
    .sort((a, b) => {
      if (a.order > b.order) {
        return 1;
      } else {
        return -1;
      }
    })
    .map((task, index) => {
      if (task.order < removeTask.order) {
        return { _id: task._id, order: index + 1, columnId: task.columnId };
      } else {
        return { _id: task._id, order: task.order - 1, columnId: task.columnId };
      }
    });
};
//todo if it possible combine fixIdenticalOrdersColumns and fixIdenticalOrdersTasks
const fixIdenticalOrdersColumns = (arrColumnsPATCH: { order: number; _id: string }[]) => {
  arrColumnsPATCH
    .sort((a, b) => {
      if (a.order > b.order) {
        return 1;
      } else if (a.order < b.order) {
        return -1;
      } else {
        return 0;
      }
    })
    .forEach((item, index) => {
      arrColumnsPATCH[index].order = index + 1;
      if (item.order === arrColumnsPATCH[index + 1]?.order) {
        //if identical order with next item in arr
        arrColumnsPATCH[index + 1].order = index + 2;
      } else if (item.order === arrColumnsPATCH[index - 1]?.order) {
        //if identical order with prev item in arr
        arrColumnsPATCH[index - 1].order = index;
      }
    });
  return arrColumnsPATCH;
};

const fixIdenticalOrdersTasks = (arrTasksPATCH: Pick<ITask, '_id' | 'order' | 'columnId'>[]) => {
  arrTasksPATCH
    .sort((a, b) => {
      if (a.order > b.order) {
        return 1;
      } else if (a.order < b.order) {
        return -1;
      } else {
        return 0;
      }
    })
    .forEach((item, index) => {
      arrTasksPATCH[index].order = index + 1;
      if (item.order === arrTasksPATCH[index + 1]?.order) {
        //if identical order with next item in arr
        arrTasksPATCH[index + 1].order = index + 2;
      } else if (item.order === arrTasksPATCH[index - 1]?.order) {
        //if identical order with prev item in arr
        arrTasksPATCH[index - 1].order = index;
      }
    });
  return arrTasksPATCH;
};

//todo:  refactor:  if possible combine function dndUpdateColumns dndUpdateTasksInsideColumn
//todo: without monitor
export const dndUpdateColumns = (
  dataColumnDrag: IColumn,
  monitor: DragSourceMonitor<IColumn, unknown>,
  dataColumns: IColumn[] | undefined,
  updateColumnsSet: (data: { set: Pick<IColumn, '_id' | 'order'>[]; boardId: string }) => void
) => {
  interface IDropResult {
    dataColumn: typeof dataColumnDrag;
  }
  const dataColumnDrop = monitor.getDropResult<IDropResult>()?.dataColumn;
  if (dataColumnDrag && dataColumnDrop && dataColumnDrag._id !== dataColumnDrop._id) {
    const { order: orderDrag } = dataColumnDrag;
    const { order: orderDrop } = dataColumnDrop;
    const newDataColumnsPATCH = dataColumns?.map((column) => {
      const { order, _id } = column;
      if (
        (order >= orderDrag && order <= orderDrop) ||
        (order >= orderDrop && order <= orderDrag)
      ) {
        //order change
        switch (order) {
          case orderDrag:
            return { order: orderDrop, _id: _id };
          case orderDrop:
            if (orderDrop > orderDrag) {
              return { order: orderDrop - 1, _id: _id };
            } else {
              return { order: orderDrop + 1, _id: _id };
            }
          default:
            if (column.order < orderDrop) {
              return { order: column.order - 1, _id: _id };
            } else {
              return { order: column.order + 1, _id: _id };
            }
        }
      } else {
        //order not change
        return { order: column.order, _id: column._id };
      }
    });
    if (newDataColumnsPATCH) {
      const newSetColumns = fixIdenticalOrdersColumns(newDataColumnsPATCH);

      updateColumnsSet({ set: newSetColumns, boardId: dataColumnDrag.boardId });
    }
  }
};

export const dndUpdateTasksInsideColumn = (
  dataTaskDrag: ITask,
  dataTaskDrop: ITask,
  dataTasks: ITask[] | undefined,
  updateTasksSet: (data: {
    set: Pick<ITask, '_id' | 'order' | 'columnId'>[];
    boardId: string;
  }) => void
) => {
  const { order: orderDrag } = dataTaskDrag;
  const { order: orderDrop } = dataTaskDrop;
  const newDataTasksPATCH = dataTasks?.map((task) => {
    const { order, _id } = task;

    if (
      (task.order >= orderDrag && task.order <= orderDrop) ||
      (task.order >= orderDrop && task.order <= orderDrag)
    ) {
      // order change
      switch (order) {
        case orderDrag:
          return { order: orderDrop, _id: _id, columnId: dataTaskDrop.columnId };
        case orderDrop:
          if (orderDrop > orderDrag) {
            return { order: orderDrop - 1, _id: _id, columnId: dataTaskDrop.columnId };
          } else {
            return { order: orderDrop + 1, _id: _id, columnId: dataTaskDrop.columnId };
          }
        default:
          if (task.order < orderDrop) {
            return { order: task.order - 1, _id: _id, columnId: dataTaskDrop.columnId };
          } else {
            return { order: task.order + 1, _id: _id, columnId: dataTaskDrop.columnId };
          }
      }
    } else {
      // order not change
      return { order: task.order, _id: task._id, columnId: task.columnId };
    }
  });
  if (newDataTasksPATCH) {
    const newSetTasks = fixIdenticalOrdersTasks(newDataTasksPATCH);
    updateTasksSet({ set: newSetTasks, boardId: dataTaskDrag.boardId });
  }
};

export const dndUpdateTasksBetweenColumn = (
  dataTaskDrag: ITask,
  dataTaskDrop: ITask,
  dataTasks: ITask[],
  dataTasksDrop: ITask[],
  updateTasksSet: (data: {
    set: Pick<ITask, '_id' | 'order' | 'columnId'>[];
    boardId: string;
  }) => void
) => {
  const dataTasksAfterDrag = getTasksAfterDelTask(dataTasks, dataTaskDrag);
  const dataTasksAfterDrop = dataTasksDrop.map((task) => {
    if (task.order < dataTaskDrop.order) {
      return { _id: task._id, order: task.order, columnId: task.columnId };
    } else {
      return { _id: task._id, order: task.order + 1, columnId: task.columnId };
    }
  });

  const setTasks = dataTasksAfterDrag.concat([
    ...dataTasksAfterDrop,
    {
      _id: dataTaskDrag._id,
      order: dataTaskDrop.order,
      columnId: dataTaskDrop.columnId,
    },
  ]);

  updateTasksSet({ set: setTasks, boardId: dataTaskDrag.boardId });
};

export const dndAddTaskToEmptyColumn = (
  dataTaskDrag: ITask,
  dataTasks: ITask[],
  columnId: string,
  updateTasksSet: (data: {
    set: Pick<ITask, '_id' | 'order' | 'columnId'>[];
    boardId: string;
  }) => void
) => {
  const dataTasksAfterDrag = getTasksAfterDelTask(dataTasks, dataTaskDrag);
  const setTasks = dataTasksAfterDrag.concat([
    { _id: dataTaskDrag._id, order: 1, columnId: columnId },
  ]);
  updateTasksSet({ set: setTasks, boardId: dataTaskDrag.boardId });
};
