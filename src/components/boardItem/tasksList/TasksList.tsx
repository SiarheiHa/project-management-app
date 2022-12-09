import { Box, Button, ButtonGroup, Card, IconButton, Input, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import React, { useRef, useState } from 'react';
import { IColumn, ITask, TaskFormFields } from 'types/types';
import TaskCard from '../taskCard/TaskCard';
import './tasksList.scss';
import {
  useDeleteTaskMutation,
  useGetColumnsQuery,
  useUpdateColumnMutation,
  useUpdateColumnsSetMutation,
  useUpdateTasksSetMutation,
  useAddTaskMutation,
} from '../../../services/board.api';
import { useGetBoardByIdQuery } from 'services/boards.api';
import Modal from 'components/Modal/Modal';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputText from 'components/InputText/InputText';
import UsersSelect from 'components/UsersSelect/UsersSelect';
import { useDrag, useDrop } from 'react-dnd';
import { dndUpdateColumns } from 'services/dndSortColumns';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import LoadingShadow from 'components/LoadingShadow/LoadingShadow';

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
  const { t } = useTranslation();
  const { _id: columnId, title, boardId } = dataColumn;
  const { data: board } = useGetBoardByIdQuery(boardId);
  const { id: currentUserId } = useCurrentUser();
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<'delete_column' | 'add_task'>('delete_column');
  const [editTitleColumn, setEditTitleColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState(dataColumn.title);

  const [updateColumn, updateColumnResult] = useUpdateColumnMutation();
  const [deleteTask, deleteTaskResult] = useDeleteTaskMutation();
  const [updateTasksSet, updateTasksSetResult] = useUpdateTasksSetMutation();
  const [addTask, addTaskResult] = useAddTaskMutation();
  const { handleSubmit, control, reset } = useForm<TaskFormFields>({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const closeModal = () => setOpenModal(false);
  const [updateColumnsSet, updateColumnsSetResults] = useUpdateColumnsSetMutation();

  const { data: dataColumns } = useGetColumnsQuery(dataColumn.boardId);
  const wrapperUpdateColumnsSet = (data: {
    set: Pick<IColumn, '_id' | 'order'>[];
    boardId: string;
  }) => {
    updateColumnsSet(data);
  };

  const ref = useRef<HTMLDivElement | null>(null);
  const refColumn = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: 'column',
      item: dataColumn,
      end: (dataColumnDrag, monitor) => {
        dndUpdateColumns(dataColumnDrag, monitor, dataColumns, wrapperUpdateColumnsSet);
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [dataColumns, dataColumn]
  );
  const [, dropRef] = useDrop(
    () => ({
      accept: 'column',
      drop: () => {
        return { dataColumn };
      },
    }),
    [dataColumns, dataColumn]
  );

  const [{ isOverCard }, dropRefCard] = useDrop(
    () => ({
      accept: 'task',
      drop: (_itemDrag, monitor) => {
        if (monitor.didDrop()) {
          return;
        }
        return { dataTasks, columnIdDrop: columnId };
      },
      collect: (monitor) => ({
        isOverCard: !!monitor.isOver(),
      }),
    }),
    [dataColumns, dataColumn]
  );

  updateColumnsSetResults.isLoading ? dragRef(dropRef(null)) : dragRef(dropRef(ref));
  dropRefCard(refColumn);

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
      updateTasksSet({ set: set, boardId: boardId });
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
          title: t('modal.column.confirmDeleteColumn', { title }),
          onClickConfirm: confirmDeleteColumn,
        };
      }
      //add_task
      default: {
        return {
          title: t('Add') + ' ' + t('Task'),
          onClickConfirm: handleSubmit(onSubmitNewTask),
        };
      }
    }
  };

  const getModalContent = () => {
    switch (modalType) {
      case 'delete_column': {
        return t('modal.column.deleteReally');
      }
      default: {
        return (
          <>
            <InputText
              name="title"
              label={t('form.fields.taskTitle')}
              autoComplete={t('form.fields.taskTitle') as string}
              control={control}
              rules={{
                required: t('form.errors.noTitle') as string,
                maxLength: {
                  value: 18,
                  message: t('form.errors.noMoreThan18Letters') as string,
                },
              }}
            />
            <InputText
              name="description"
              label={t('form.fields.taskDescription')}
              autoComplete={t('form.fields.taskDescription') as string}
              control={control}
              multiline
              maxRows={6}
              rules={{
                required: t('form.errors.noDescription') as string,
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

  const styleDnD: Record<string, string | number> = {
    opacity: isDragging ? 0 : 1,

    cursor: updateColumnsSetResults.isLoading ? 'wait!important' : 'move!important',
  };
  const styleDnDForCard = {
    minHeight: isOverCard ? '70px!important' : '30px',
    transition: 'all .5s',
    cursor: updateColumnsSetResults.isLoading ? 'wait!important' : 'move!important',
  };

  return (
    <>
      <Box className="board-column" sx={styleDnD}>
        <Card variant="outlined" ref={ref} sx={styleDnD} className="board-column-inner">
          <Box
            className="column-name"
            sx={{ backgroundColor: 'primary.main', color: '#FFFFFF' }}
            position="relative"
          >
            {updateColumnsSetResults.isLoading && <LoadingShadow />}
            {!editTitleColumn && (
              <>
                <Stack
                  className="column-title"
                  direction="row"
                  justifyContent={'space-between'}
                  spacing={1}
                  onClick={() => setEditTitleColumn(!editTitleColumn)}
                >
                  <Typography variant={'h5'}>
                    {updateColumnResult.isLoading ? t('updating') : title}
                  </Typography>{' '}
                  <IconButton onClick={(e) => handleDeleteColumn(e)} sx={{ color: '#FFFFFF' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </>
            )}
            {editTitleColumn && (
              <Stack className="column-title-edit" direction="row" spacing={2}>
                <Input
                  inputProps={{
                    maxLength: 16,
                  }}
                  onChange={(e) => {
                    setNewColumnTitle(e.currentTarget.value);
                  }}
                  value={newColumnTitle}
                  sx={{ color: '#FFFFFF' }}
                  className="column-title-input"
                ></Input>
                <ButtonGroup>
                  <IconButton onClick={() => setEditTitleColumn(false)} sx={{ color: '#FFFFFF' }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={handleUpdateColumn} sx={{ color: '#FFFFFF' }}>
                    <DoneIcon fontSize="small" />
                  </IconButton>
                </ButtonGroup>
              </Stack>
            )}
          </Box>

          <Stack
            className="tasks-list"
            direction={'column'}
            spacing={1}
            ref={refColumn}
            sx={{ ...styleDnDForCard }}
            position="relative"
          >
            {(deleteTaskResult.isLoading || updateTasksSetResult.isLoading) && <LoadingShadow />}

            {dataTasks &&
              [...dataTasks]
                .sort((a, b) => {
                  if (a.order > b.order) {
                    return 1;
                  } else {
                    return -1;
                  }
                })
                .map((task) => {
                  return (
                    <TaskCard
                      key={task._id}
                      dataTask={task}
                      dataTasks={dataTasks}
                      onDelete={onDeleteTask}
                    ></TaskCard>
                  );
                })}
          </Stack>
          <Button variant="contained" fullWidth onClick={handleAddTask}>
            {addTaskResult.isLoading ? t('updating') : t('Add') + ' ' + t('Task')}
          </Button>
        </Card>
      </Box>
      <Modal open={openModal} {...getModalProps()} onClickCancel={closeModal}>
        {getModalContent()}
      </Modal>
    </>
  );
}
