import { Box, Card, Divider, IconButton, Stack, Typography } from '@mui/material';
import InputText from 'components/InputText/InputText';
import Modal from 'components/Modal/Modal';
import UserChip from 'components/UserChip/UserChip';
import UsersSelect from 'components/UsersSelect/UsersSelect';
import React, { useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useUpdateTaskMutation } from 'services/board.api';
import { useGetBoardByIdQuery } from 'services/boards.api';
import { useGetUsersQuery } from 'services/users.api';
import { ITask, IUserInfo, TaskFormFields } from 'types/types';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDrag, useDrop } from 'react-dnd';
import { useUpdateTasksSetMutation } from 'services/board.api';
import {
  dndAddTaskToEmptyColumn,
  dndUpdateTasksBetweenColumn,
  dndUpdateTasksInsideColumn,
} from 'services/dndSortColumns';
import RoundUsersAvatars from 'components/RoundUsersAvatars/RoundUsersAvatars';
import { useTranslation } from 'react-i18next';
import { rules } from '../../../utils/validation.utils';
import LoadingShadow from 'components/LoadingShadow/LoadingShadow';

type ModalType = 'delete' | 'edit' | 'view';

interface IDropResultTask {
  dataTask: ITask;
  dataTasks: ITask[];
  isOverCurrent: boolean;
  columnIdDrop: string;
}
type taskCardProps = {
  dataTask: ITask;
  dataTasks: ITask[];
  onDelete: (task: ITask) => void;
};

export default function TaskCard({ dataTask, dataTasks, onDelete }: taskCardProps): JSX.Element {
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('view');
  const { t } = useTranslation();
  const { data: board } = useGetBoardByIdQuery(dataTask.boardId);
  const { data: allUsers } = useGetUsersQuery('');
  const [updateTask, updateTaskResult] = useUpdateTaskMutation();

  const { handleSubmit, control } = useForm<TaskFormFields>({
    defaultValues: {
      title: dataTask.title,
      description: dataTask.description,
    },
  });

  const { title, description } = dataTask;
  const [updateTasksSet, updateTasksSetResult] = useUpdateTasksSetMutation();
  const wrapperUpdateTasksSet = (data: {
    set: Pick<ITask, '_id' | 'order' | 'columnId'>[];
    boardId: string;
  }) => {
    updateTasksSet(data);
  };

  const refTask = useRef(null);

  const [{ isDragging }, dragRefTask] = useDrag(
    () => ({
      type: 'task',
      item: dataTask,
      end: (dataTaskDrag, monitor) => {
        const dataTaskDrop = monitor.getDropResult<IDropResultTask>()?.dataTask;
        const dataTasksDrop = monitor.getDropResult<IDropResultTask>()?.dataTasks;
        const columnIdDrop = monitor.getDropResult<IDropResultTask>()?.columnIdDrop;

        if (
          dataTaskDrag &&
          dataTaskDrop &&
          dataTasksDrop &&
          dataTaskDrag._id !== dataTaskDrop._id
        ) {
          if (dataTaskDrag.columnId === dataTaskDrop.columnId) {
            dndUpdateTasksInsideColumn(
              dataTaskDrag,
              dataTaskDrop,
              dataTasks,
              wrapperUpdateTasksSet
            );
          } else {
            dndUpdateTasksBetweenColumn(
              dataTask,
              dataTaskDrop,
              dataTasks,
              dataTasksDrop,
              wrapperUpdateTasksSet
            );
          }
        } else if (dataTaskDrag && columnIdDrop) {
          dndAddTaskToEmptyColumn(dataTask, dataTasks, columnIdDrop, wrapperUpdateTasksSet);
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [dataTasks]
  );

  const [, dropRefTask] = useDrop(
    () => ({
      accept: 'task',
      drop: (_item, monitor) => {
        if (monitor.didDrop()) {
          return;
        }
        return { dataTask, dataTasks, monitor };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [dataTasks]
  );

  updateTasksSetResult.isLoading
    ? dragRefTask(dropRefTask(null))
    : dragRefTask(dropRefTask(refTask));

  const styleDnD = {
    opacity: isDragging ? 0 : 1,
    cursor: updateTasksSetResult.isLoading ? 'wait!important' : 'move!important',
  };

  const closeModal = () => setOpenModal(false);

  const handleEditTask = () => {
    setModalType('edit');
    setOpenModal(true);
  };

  const handleShowTask = (e: React.MouseEvent) => {
    setModalType('view');
    setOpenModal(true);
  };
  const handleDeleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalType('delete');
    setOpenModal(true);
  };

  let users: string[] = dataTask.users;
  const onShare = (usersId: string[]) => {
    users = usersId;
  };

  const onSubmitEditedTask: SubmitHandler<TaskFormFields> = (data) => {
    updateTask({ ...dataTask, ...data, users });
    closeModal();
  };

  const ownerObj = allUsers?.find(({ id }) => id === dataTask.userId);
  const contributors = dataTask.users.reduce((acc: IUserInfo[], userId) => {
    const contributor = allUsers?.find(({ id }) => userId === id);
    return contributor ? [...acc, contributor] : acc;
  }, []);

  const getModalProps = () => {
    switch (modalType) {
      case 'delete': {
        return {
          title: t('modal.task.confirmDeleteTask', { title }),
          onClickConfirm: confirmDeleteTask,
        };
      }
      case 'edit': {
        return {
          title: t('modal.task.editTask', { title }),
          onClickConfirm: handleSubmit(onSubmitEditedTask),
        };
      }
      default: {
        return {
          title,
          onClickConfirm: handleEditTask,
          confirmButtonText: t('modal.edit'),
          cancelButtonText: t('modal.close'),
        };
      }
    }
  };

  const getModalContent = () => {
    switch (modalType) {
      case 'delete': {
        return t('modal.task.deleteReally');
      }
      case 'edit': {
        return (
          <>
            <InputText
              name="title"
              label={t('form.fields.taskTitle')}
              autoComplete={t('form.fields.taskTitle') as string}
              control={control}
              rules={rules.taskTitle}
            />
            <InputText
              name="description"
              label={t('form.fields.taskDescription')}
              autoComplete={t('form.fields.taskDescription') as string}
              control={control}
              multiline
              maxRows={6}
              rules={rules.taskDescription}
            />

            <UsersSelect
              onUserSelect={onShare}
              selectedUsersId={dataTask.users}
              usersIdForSelection={board && [...board.users, board.owner]}
            />
          </>
        );
      }
      default: {
        return (
          <Stack spacing={2} minWidth={'230px'}>
            {dataTask.description && (
              <>
                <Typography variant="body1" overflow={'auto'}>
                  {dataTask.description}
                </Typography>
                <Divider />
              </>
            )}
            <Box>
              <Typography variant="body1" component={'span'} sx={{ pr: '2px' }}>
                {t('modal.task.creator')}
              </Typography>
              {ownerObj && <UserChip login={ownerObj.login} isOwner />}
            </Box>

            {Boolean(contributors.length) && (
              <>
                <Divider />
                <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography variant="body1" component={'span'} sx={{ pr: '2px' }}>
                    {t('modal.task.users')}
                  </Typography>
                  {contributors.map((contributor) => (
                    <UserChip key={contributor.id} login={contributor.login} />
                  ))}
                </Box>
              </>
            )}
          </Stack>
        );
      }
    }
  };

  const confirmDeleteTask = () => {
    //TODO переписать поднять в тасклист вызов deleteTask const [deleteTask] = useDeleteTaskMutation();
    onDelete(dataTask);
    closeModal();
  };

  return (
    <>
      <Card
        ref={refTask}
        variant="outlined"
        onClick={handleShowTask}
        sx={{ position: 'relative', overflow: 'visible', padding: '5px', ...styleDnD }}
      >
        {(updateTaskResult.isLoading || updateTasksSetResult.isLoading) && <LoadingShadow />}
        <IconButton
          onClick={(e) => handleDeleteTask(e)}
          sx={{ position: 'absolute', top: '4px', right: '8px' }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
        <Typography component="h3" mt={1} variant={'h6'}>
          {title}
        </Typography>
        <Typography component="p" variant={'body1'}>
          {description.length > 24 ? `${description.slice(0, 24)}...` : description}
        </Typography>
        <RoundUsersAvatars logins={contributors.map(({ login }) => login)} />
        {/* <Typography component="p"> Order:{order}</Typography> */}
      </Card>
      <Modal open={openModal} {...getModalProps()} onClickCancel={closeModal}>
        {getModalContent()}
      </Modal>
    </>
  );
}
