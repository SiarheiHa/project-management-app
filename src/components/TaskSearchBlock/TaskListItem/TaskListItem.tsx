import { Box, Button, Divider, ListItem, ListItemText, Typography } from '@mui/material';
import UserChip from 'components/UserChip/UserChip';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUsersQuery } from 'services/users.api';
import { ITask } from 'types/types';
import { useTranslation } from 'react-i18next';

const TaskListItem = ({ task }: { task: ITask }) => {
  const { data: allUsers } = useGetUsersQuery('');
  const { boardId, description, title, userId, users } = task;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getLoginById = (id: string) => {
    return allUsers?.find((user) => user.id === id)?.login || (t('accountDeleted') as string);
  };

  const goBoard = () => navigate(`/boards/${boardId}`);

  // if (isError || isLoading) {
  //   return null;
  // }

  return (
    <>
      <Divider />
      <ListItem
        sx={{ flexDirection: 'column', alignItems: 'start', flexWrap: 'wrap', gap: '2px', pb: 2 }}
      >
        <ListItemText sx={{ overflowX: 'auto', width: '100%' }}>
          {t('form.fields.taskTitle')}:
          <Typography component={'span'} variant={'h5'}>
            {title}
          </Typography>
        </ListItemText>
        <ListItemText sx={{ overflowX: 'auto', width: '100%' }}>
          {t('form.fields.taskDescription')}:
          <Typography component={'span'} variant={'h6'}>
            {description}
          </Typography>
        </ListItemText>
        <Box display={'flex'}>
          <ListItemText sx={{ pr: '2px' }}>{t('modal.task.creator')}</ListItemText>
          <UserChip login={getLoginById(userId)} isOwner />
        </Box>

        <Box display={'flex'} alignItems="center">
          <ListItemText sx={{ pr: '2px' }}>{t('modal.task.users')}</ListItemText>
          {Boolean(users.length) ? (
            <Box
              display={'flex'}
              sx={{
                flexWrap: 'wrap',
                gap: '2px',
              }}
            >
              {users.map((userId) => (
                <UserChip key={userId} login={getLoginById(userId)} />
              ))}
            </Box>
          ) : (
            t('noUsers')
          )}
        </Box>

        <Button onClick={goBoard} variant="contained" sx={{ mt: 1 }}>
          {t('task.goToBoard')}
        </Button>
      </ListItem>
    </>
  );
};

export default TaskListItem;
