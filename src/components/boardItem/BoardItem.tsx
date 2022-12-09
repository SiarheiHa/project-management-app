import { Button, CircularProgress } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import './boardItem.scss';
import TasksList from './tasksList/TasksList';
import {
  useDeleteColumnMutation,
  useGetColumnsQuery,
  useGetTasksByBoardIdQuery,
  useUpdateColumnsSetMutation,
} from './../../services/board.api';
import { useNavigate, useParams } from 'react-router-dom';
import ModalCreate from './ModalCreate/ModalCreate';
import { useAppDispatch } from 'store/redux.hooks';

import { useGetBoardByIdQuery } from 'services/boards.api';
import { IColumn, ServerError } from 'types/types';
import { useTranslation } from 'react-i18next';
import BoardInfoBlock from './BoardInfoBlock/BoardInfoBlock';
import { showToast } from 'store/toastSlice';
import ErrorAlert from 'components/ErrorAlert/ErrorAlert';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function BoardItem(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const idBoard = useParams().id as string;
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const { id: userId } = useCurrentUser();
  const [deleteColumn, deleteColumnsSetResult] = useDeleteColumnMutation();
  const [updateColumsSet, updateColumnsSetResult] = useUpdateColumnsSetMutation();
  const dispatch = useAppDispatch();

  const {
    data: dataCurrentBoard,
    isLoading: isBoardLoading,
    isError: isBoardError,
    error: boardError,
  } = useGetBoardByIdQuery(idBoard);
  const {
    data: dataColumns,
    isLoading: isColumnsLoading,
    isError: isColumnsError,
  } = useGetColumnsQuery(idBoard);

  const {
    data: dataTasksByBoardId,
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useGetTasksByBoardIdQuery(idBoard);

  const isError =
    isBoardError ||
    isTasksError ||
    isColumnsError ||
    deleteColumnsSetResult.isError ||
    updateColumnsSetResult.isError;

  const handleAddColumn = () => {
    setOpenModalCreate(true);
  };

  const onDeleteColumn = (selectedColumn: IColumn) => {
    deleteColumn(selectedColumn);
    if (dataColumns && selectedColumn.order !== dataColumns?.length) {
      const filteredColumns = dataColumns.filter(({ _id }) => _id !== selectedColumn._id);
      const set = filteredColumns.map((column) => {
        if (column.order < selectedColumn.order) {
          return {
            _id: column._id,
            order: column.order,
          };
        } else {
          return {
            _id: column._id,
            order: column.order - 1,
          };
        }
      });
      updateColumsSet({ set: set, boardId: selectedColumn.boardId });
    }
  };

  useEffect(() => {
    const isMember = () => {
      return (
        dataCurrentBoard?.owner === userId || dataCurrentBoard?.users.some((id) => id === userId)
      );
    };

    if (dataCurrentBoard === null || (dataCurrentBoard && !isMember())) {
      navigate('/boards/');
    }
  });

  useEffect(() => {
    if (boardError) {
      if ((boardError as ServerError)?.data) {
        dispatch(
          showToast({
            message: (boardError as ServerError).data.message || t('boards.serverError'),
            type: 'error',
          })
        );
        if ((boardError as ServerError).status === 404) {
          navigate('/boards/');
        }
      }
    }
  }, [boardError, dispatch, navigate, t]);

  return (
    <Box className={'board'}>
      <Stack className="board-header">
        {(isBoardLoading || isTasksLoading || isColumnsLoading) && <CircularProgress size={80} />}
        {isError && <ErrorAlert />}
        {dataCurrentBoard && <BoardInfoBlock board={dataCurrentBoard} />}
      </Stack>

      <Stack
        className="board-body"
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          margin: 0,
          display: 'flex',
          maxHeight: '100%',
        }}
        position="relative"
      >
        {dataColumns &&
          [...dataColumns]
            .sort((a, b) => {
              if (a.order > b.order) {
                return 1;
              } else {
                return -1;
              }
            })
            .map((dataColumn) => {
              const tasksByColumn = dataTasksByBoardId?.filter(
                (item) => item.columnId === dataColumn._id
              );
              return (
                <TasksList
                  key={dataColumn._id}
                  dataColumn={dataColumn}
                  dataTasks={tasksByColumn}
                  onDeleteColumn={onDeleteColumn}
                />
              );
            })}

        <Box className="board-add-list board-column">
          <Button
            className="button-add-list"
            variant="contained"
            fullWidth
            onClick={handleAddColumn}
          >
            {t('Add') + ' ' + t('List')}
          </Button>
        </Box>
      </Stack>
      {dataColumns && (
        <ModalCreate
          type="List"
          action="Add"
          boardId={idBoard || ''}
          currentLength={dataColumns.length}
          openModal={openModalCreate}
          closeModal={() => setOpenModalCreate(false)}
        ></ModalCreate>
      )}
    </Box>
  );
}
