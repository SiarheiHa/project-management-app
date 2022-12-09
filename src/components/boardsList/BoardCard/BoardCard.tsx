import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Badge,
  IconButton,
  Box,
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import DeleteIcon from '@mui/icons-material/Delete';
import { Board } from 'types/types';
import Modal from 'components/Modal/Modal';
import { useDeleteBoardMutation, useUpdateBoardMutation } from 'services/boards.api';
import { useAppDispatch } from 'store/redux.hooks';

import { useNavigate } from 'react-router-dom';
import LoadingShadow from 'components/LoadingShadow/LoadingShadow';
import { showToast } from 'store/toastSlice';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../../../hooks/useCurrentUser';

const BoardCard = ({ board }: { board: Board }) => {
  const navigate = useNavigate();
  const goBoard = () => navigate(`/boards/${board._id}`);
  const [modalOpen, setModalOpen] = useState(false);
  const { id: currentUserId } = useCurrentUser();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isOwner = currentUserId === board.owner;
  const modalTitle =
    t(isOwner ? 'modal.board.onDeleteTitle' : 'modal.board.onLeaveTitle') + ` ${board.title}?`;
  const modalText = t(isOwner ? 'modal.board.onDeleteText' : 'modal.board.onLeaveText');

  const [deleteBoard, deleteResult] = useDeleteBoardMutation();
  const [updateBoard, updateResult] = useUpdateBoardMutation();
  const isLoading = deleteResult.isLoading || updateResult.isLoading;
  const isSuccess = deleteResult.isSuccess || updateResult.isSuccess;

  const onClickDelete = () => {
    setModalOpen(true);
  };
  const onModalClose = () => setModalOpen(false);
  const onBoardDelete = () => {
    if (isOwner) {
      deleteBoard(board._id);
    } else {
      const users = board.users.filter((id) => id !== currentUserId);
      updateBoard({ ...board, users });
    }
    onModalClose();
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        showToast({
          message: t(isOwner ? 'boards.toast.onSuccessDelete' : 'boards.toast.onSuccessLeave'),
          type: 'success',
        })
      );
    }
  }, [dispatch, isOwner, isSuccess, t]);

  return (
    <>
      <Card sx={{ position: 'relative' }}>
        {isLoading && <LoadingShadow />}
        <Box display="flex" justifyContent={'space-between'} flexGrow={'1'}>
          <Box>
            <CardContent>
              <Typography variant="h5" component="div">
                {board.title}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {t(isOwner ? 'boards.roleIsOwner' : 'boards.roleIsContributor')}
              </Typography>
              <Typography variant="body2">
                <Badge badgeContent={board.users.length + 1} color="primary">
                  <AssignmentIndIcon color="action" fontSize="large" />
                </Badge>
              </Typography>
            </CardContent>
            <CardActions sx={{ pt: 0 }}>
              <Button variant="contained" onClick={goBoard}>
                {t('boards.open')}
              </Button>
            </CardActions>
          </Box>
          <Box>
            <IconButton onClick={onClickDelete}>
              <DeleteIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box>
      </Card>
      <Modal
        open={modalOpen}
        title={modalTitle}
        onClickConfirm={onBoardDelete}
        onClickCancel={onModalClose}
      >
        {modalText}
      </Modal>
    </>
  );
};

export default BoardCard;
