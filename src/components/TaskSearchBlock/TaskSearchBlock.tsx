import { Box, CircularProgress, List } from '@mui/material';
import ErrorAlert from 'components/ErrorAlert/ErrorAlert';
import Searchbar from 'components/Searchbar/Searchbar';
import { useCurrentUser } from 'hooks/useCurrentUser';
import React, { useState } from 'react';
import { useGetTasksSetBySearchQuery } from 'services/board.api';
import { selectSearchValue, setSearchValue } from 'store/boardsPageSlice';
import { useAppDispatch, useAppSelector } from 'store/redux.hooks';
import TaskListItem from './TaskListItem/TaskListItem';

const TaskSearchBlock = () => {
  const searchValue = useAppSelector(selectSearchValue);
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState(searchValue);
  const { id: currentUserId } = useCurrentUser();
  const {
    data: tasks,
    isError,
    isFetching,
  } = useGetTasksSetBySearchQuery({
    userId: currentUserId,
    searchString: searchValue,
  });

  const onSearchInputChange = (value: string) => {
    setInputValue(value);
  };
  const searchTasks = () => {
    dispatch(setSearchValue({ searchValue: inputValue }));
  };

  // TODO need refactor
  const getFilteredTask = () => {
    if (!tasks || !tasks.length) {
      return [];
    }
    return tasks.filter((task) => {
      if (task.userId === currentUserId) {
        return true;
      }
      if (task.users.includes(currentUserId)) {
        return true;
      }
      return false;
    });
  };

  const userTasks = getFilteredTask();

  return (
    <Box>
      <Searchbar value={inputValue} onChange={onSearchInputChange} onSubmit={searchTasks} />
      {isFetching && <CircularProgress size={80} />}
      {isError && <ErrorAlert />}
      {!isFetching && !isError && (
        <List>
          {Boolean(userTasks.length) &&
            userTasks.map((task) => <TaskListItem key={task._id} task={task} />)}
        </List>
      )}
    </Box>
  );
};

export default TaskSearchBlock;
