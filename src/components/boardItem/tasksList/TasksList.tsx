import { Box, Button, ButtonGroup, Card, Input, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';
import { IColumn, ITask, TaskFormFields } from 'types/types';
import TaskCard from '../taskCard/TaskCard';
import './tasksList.scss';
import {
  useDeleteTaskMutation,
  useUpdateColumnMutation,
  useUpdateTasksSetMutation,
  useAddTaskMutation,
  //useGetTasksByColumnQuery,
} from './../../../services/board.api';
import { useGetBoardByIdQuery } from 'services/boards.api';
import Modal from 'components/Modal/Modal';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppSelector } from 'store/redux.hooks';
import { selectUser } from 'store/userSlice';
import InputText from 'components/InputText/InputText';
import UsersSelect from 'components/UsersSelect/UsersSelect';

interface ITaskListProps {
  dataColumn: IColumn;
  dataTasks: ITask[] | undefined;
  onDeleteColumn: (selectedColumn: IColumn) => void;
}

export default function TasksList({
  dataColumn,
  dataTasks,
  onDeleteColumn,
}: ITaskListProps): JSX.Element {
  const { _id: columnId, title, boardId } = dataColumn;
  const { data: board } = useGetBoardByIdQuery(boardId);
  const { id: currentUserId } = useAppSelector(selectUser);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<'delete_column' | 'add_task'>('delete_column');
  const [editTitleColumn, setEditTitleColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState(dataColumn.title);
  const [updateColumn] = useUpdateColumnMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTasksSet] = useUpdateTasksSetMutation();
  const [addTask] = useAddTaskMutation();
  const { handleSubmit, control, reset } = useForm<TaskFormFields>({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const closeModal = () => setOpenModal(false);

  const confirmDeleteColumn = () => {
    onDeleteColumn(dataColumn);
    setOpenModal(false);
  };

  const handleDeleteColumn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalType('delete_column');
    setOpenModal(true);
  };

  const handleUpdateColumn = () => {
    const newColumnData = { _id: columnId, title: newColumnTitle, order: dataColumn.order };
    if (newColumnTitle !== dataColumn.title) {
      updateColumn(newColumnData);
    }
    // todo: order

    setEditTitleColumn(!editTitleColumn);
  };

  const handleAddTask = () => {
    setModalType('add_task');
    setOpenModal(true);
  };

  const onDeleteTask = (selectedTask: ITask) => {
    deleteTask(selectedTask);
    if (dataTasks && selectedTask.order !== dataTasks?.length) {
      const filteredTasks = dataTasks.filter(({ _id }) => _id !== selectedTask._id);
      const set = filteredTasks.map((task) => {
        if (task.order < selectedTask.order) {
          return {
            _id: task._id,
            order: task.order,
            columnId: task.columnId,
          };
        } else {
          return {
            _id: task._id,
            order: task.order - 1,
            columnId: task.columnId,
          };
        }
      });
      updateTasksSet(set);
    }
  };

  let users: string[] = [];
  const onShare = (usersId: string[]) => {
    users = usersId;
  };

  const onSubmitNewTask: SubmitHandler<TaskFormFields> = (data) => {
    addTask({
      title: data.title,
      order: dataTasks?.length ? dataTasks.length + 1 : 1,
      boardId: boardId,
      columnId: columnId,
      description: data.description,
      userId: currentUserId,
      users: users,
    });
    closeModal();
    reset();
  };

  const getModalProps = () => {
    switch (modalType) {
      case 'delete_column': {
        return {
          title: `do you really want to remove "${title}" list?`,
          onClickConfirm: confirmDeleteColumn,
        };
      }
      //add_task
      default: {
        return {
          title: 'Add task',
          onClickConfirm: handleSubmit(onSubmitNewTask),
        };
      }
    }
  };

  const getModalContent = () => {
    switch (modalType) {
      case 'delete_column': {
        return 'if you delete this list you will not be able to restore it';
      }
      default: {
        return (
          <>
            <InputText
              name="title"
              label={`Task title`}
              autoComplete={`Task title`}
              control={control}
              rules={{
                required: 'title is required',
                maxLength: {
                  value: 18,
                  message: 'No more then 18 letters',
                },
              }}
            />
            <InputText
              name="description"
              label={`Task description`}
              autoComplete={`Task description`}
              control={control}
              multiline
              maxRows={6}
              rules={{
                required: 'description is required',
              }}
            />
            <UsersSelect
              onUserSelect={onShare}
              usersIdForSelection={board && [...board.users, board.owner]}
            />
          </>
        );
      }
    }
  };

  return (
    <>
      <Card className="board-column" variant="outlined">
        <Box className="column-name">
          {!editTitleColumn && (
            <Stack
              className="column-title"
              direction="row"
              spacing={2}
              onClick={() => setEditTitleColumn(!editTitleColumn)}
            >
              <Typography variant={'h5'}>{title}</Typography>{' '}
              <Button onClick={(e) => handleDeleteColumn(e)}>Del</Button>
              <p>order: {dataColumn.order}</p>
            </Stack>
          )}
          {editTitleColumn && (
            <Stack className="column-title-edit" direction="row" spacing={2}>
              <Input
                onChange={(e) => {
                  setNewColumnTitle(e.currentTarget.value);
                }}
                value={newColumnTitle}
              ></Input>
              <ButtonGroup>
                <Button onClick={handleUpdateColumn}>update</Button>
                <Button onClick={() => setEditTitleColumn(!editTitleColumn)}>no</Button>
              </ButtonGroup>
            </Stack>
          )}
        </Box>

        <Stack className="tasks-list" direction={'column'} spacing={1}>
          {dataTasks &&
            dataTasks.map((task) => {
              return <TaskCard key={task._id} dataTask={task} onDelete={onDeleteTask}></TaskCard>;
            })}
        </Stack>
        <Button variant="contained" fullWidth onClick={handleAddTask}>
          Add task
        </Button>
      </Card>
      <Modal open={openModal} {...getModalProps()} onClickCancel={closeModal}>
        {getModalContent()}
      </Modal>
    </>
  );
}
