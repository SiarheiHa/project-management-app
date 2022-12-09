import React from 'react';
import InputText from 'components/InputText/InputText';
import Modal from 'components/Modal/Modal';
import UsersSelect from 'components/UsersSelect/UsersSelect';
import { SubmitHandler, useForm } from 'react-hook-form';
import LoadingBackdrop from 'components/LoadingBackdrop/LoadingBackdrop';
import { useCreateBoardMutation } from 'services/boards.api';

import { useTranslation } from 'react-i18next';
import { BoardFormFields } from 'types/types';
import { useCurrentUser } from '../../hooks/useCurrentUser';
type CreateBoardModalProps = { open: boolean; onModalClose: () => void };
const CreateBoardModal = ({ open, onModalClose }: CreateBoardModalProps) => {
  const { t } = useTranslation();
  let users: string[] = [];
  const { id } = useCurrentUser();
  const [createBoard, result] = useCreateBoardMutation();
  const { handleSubmit, control } = useForm<BoardFormFields>({
    defaultValues: {
      title: '',
    },
  });

  const onSubmit: SubmitHandler<BoardFormFields> = (data) => {
    createBoard({ ...data, owner: id, users });
    onModalClose();
  };

  const onShare = (usersId: string[]) => {
    users = usersId;
  };

  if (result.isLoading) {
    return <LoadingBackdrop />;
  }

  return (
    <Modal
      open={open}
      title={`${t('Create')} ${t('board')}`}
      onClickCancel={onModalClose}
      onClickConfirm={handleSubmit(onSubmit)}
    >
      <>
        <InputText
          name="title"
          label={t('form.fields.boardTitle')}
          autoComplete="title"
          control={control}
          rules={{
            required: t('form.errors.noTitle') as string,
          }}
          inputProps={{
            style: { fontSize: '1.2rem' },
          }}
        />
        <UsersSelect onUserSelect={onShare} />
      </>
    </Modal>
  );
};

export default CreateBoardModal;
