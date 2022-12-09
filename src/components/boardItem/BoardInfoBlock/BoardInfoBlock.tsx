import { Stack, ButtonGroup, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import React, { useEffect, useState } from 'react';
import { Board, BoardFormFields, IUserInfo } from 'types/types';
import { useTranslation } from 'react-i18next';
import { useDeleteBoardMutation, useUpdateBoardMutation } from 'services/boards.api';
import { useGetUsersQuery } from 'services/users.api';
import { useAppDispatch } from 'store/redux.hooks';
import { showToast } from 'store/toastSlice';
import Modal from 'components/Modal/Modal';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputText from 'components/InputText/InputText';
import UsersSelect from 'components/UsersSelect/UsersSelect';
import UserChip from 'components/UserChip/UserChip';
import { rules } from '../../../utils/validation.utils';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { useNavigate } from 'react-router-dom';
import LoadingShadow from 'components/LoadingShadow/LoadingShadow';

const BoardInfoBlock = ({ board }: { board: Board }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'delete' | 'edit'>('delete');
  const { id: currentUserId } = useCurrentUser();
  const { data: allUsers } = useGetUsersQuery('');
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isOwner = currentUserId === board.owner;
  const modalDeleteTitle =
    t(isOwner ? 'modal.board.onDeleteTitle' : 'modal.board.onLeaveTitle') + ` ${board.title}?`;
  const modalDeleteText = t(isOwner ? 'modal.board.onDeleteText' : 'modal.board.onLeaveText');
  const { handleSubmit, control } = useForm<BoardFormFields>({
    defaultValues: {
      title: board.title,
    },
  });
  let users: string[] = board.users;
  const onShare = (usersId: string[]) => {
    users = usersId;
  };
  const modalEditContent = (
    <>
      <InputText
        name="title"
        label={t('form.fields.boardTitle')}
        autoComplete="title"
        control={control}
        rules={rules.boardInfo}
        inputProps={{
          style: { fontSize: '1.2rem' },
        }}
      />
      <UsersSelect onUserSelect={onShare} selectedUsersId={board.users} />
    </>
  );

  const [deleteBoard, deleteResult] = useDeleteBoardMutation();
  const [updateBoard, updateResult] = useUpdateBoardMutation();
  const isLoading = deleteResult.isLoading || updateResult.isLoading;

  const onClickDelete = () => {
    setModalType('delete');
    setModalOpen(true);
  };
  const onClickEdit = () => {
    setModalType('edit');
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
  const onBoardEdit: SubmitHandler<BoardFormFields> = (data) => {
    updateBoard({ ...board, users, title: data.title });
    onModalClose();
  };

  useEffect(() => {
    if (deleteResult.isSuccess) {
      dispatch(
        showToast({
          message: t('boards.toast.onSuccessDelete'),
          type: 'success',
        })
      );
    } else if (updateResult.isSuccess) {
      dispatch(
        showToast({
          message: t(isOwner ? 'boards.toast.onSuccessUpdate' : 'boards.toast.onSuccessLeave'),
          type: 'success',
        })
      );
    }
  }, [deleteResult.isSuccess, updateResult.isSuccess, dispatch, isOwner, t]);

  const ownerObj = allUsers?.find(({ id }) => id === board.owner);
  const contributors = board.users.reduce((acc: IUserInfo[], userId) => {
    const contributor = allUsers?.find(({ id }) => userId === id);
    return contributor ? [...acc, contributor] : acc;
  }, []);

  return (
    <>
      {isLoading && <LoadingShadow />}
      <Stack
        className="board-nav"
        direction={{ xs: 'row', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
        sx={{ pl: 1, pb: 1 }}
      >
        <IconButton onClick={() => navigate('/boards')}>
          <HomeIcon fontSize="large" />
        </IconButton>
        <Typography variant={'h4'} component="h2" className="board-title">
          / {board.title}
        </Typography>
        <ButtonGroup>
          {isOwner && (
            <IconButton onClick={onClickEdit}>
              <EditIcon fontSize="large" />
            </IconButton>
          )}
          <IconButton onClick={onClickDelete}>
            <DeleteIcon fontSize="large" />
          </IconButton>
        </ButtonGroup>
      </Stack>

      {/* //TODO  вынести в отдельный компонент*/}
      {ownerObj && (
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, pl: 1 }}>
          <UserChip login={ownerObj.login} isOwner />
          {Boolean(contributors.length) &&
            contributors.map((contributor) => (
              <UserChip key={contributor.id} login={contributor.login} />
            ))}
        </Stack>
      )}

      <Modal
        open={modalOpen}
        title={modalType === 'delete' ? modalDeleteTitle : (t('modal.board.editBoard') as string)}
        onClickConfirm={modalType === 'delete' ? onBoardDelete : handleSubmit(onBoardEdit)}
        onClickCancel={onModalClose}
      >
        {modalType === 'delete' ? modalDeleteText : modalEditContent}
      </Modal>
    </>
  );
};

export default BoardInfoBlock;
