import React, { useState } from 'react';
import './Profile.scss';
import InputText from '../InputText/InputText';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button, Typography, Box, Card, Grid, Avatar, CardContent } from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useAppDispatch } from '../../store/redux.hooks';
import Modal from '../Modal/Modal';
import { Warning } from '@mui/icons-material';
import { showToast } from 'store/toastSlice';
import { rules } from '../../utils/validation.utils';
import { useTranslation } from 'react-i18next';
import { useDeleteUserMutation, useSetUserInfoMutation } from '../../services/users.api';

import { useNavigate } from 'react-router-dom';
import { IProfile } from '../../types/types';
import { useCurrentUser } from '../../hooks/useCurrentUser';

const Profile = () => {
  const user = useCurrentUser();
  const dispatch = useAppDispatch();
  const [setUserInfo, { isLoading }] = useSetUserInfoMutation();
  const [deleteUser, { isLoading: isDeleteLoading }] = useDeleteUserMutation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm<IProfile>({
    defaultValues: {
      name: user.name,
      login: user.login,
      password: '',
    },
  });

  const onSubmit: SubmitHandler<IProfile> = (data) => {
    setUserInfo({ ...data, id: user.id })
      .unwrap()
      .then(() => {
        dispatch(showToast({ type: 'success', message: t('auth.toast.successSetUserInfo') }));
        navigate('/boards');
      })
      .catch((error) => {
        dispatch(showToast({ message: t(error.data.message) }));
      });
  };

  const handleDeleteUser = () => {
    deleteUser(user.id)
      .unwrap()
      .then(() => {
        setOpen(false);
        dispatch(showToast({ message: t('auth.toast.successUserDelete'), type: 'success' }));
        navigate('/');
      });
  };

  const { t } = useTranslation();

  return (
    <Card component="form" onSubmit={handleSubmit(onSubmit)} className="ProfileForm">
      <CardContent className="inner">
        {/*{isError && <Alert severity="error">{error!.data!.message}</Alert>}*/}
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <AccountBoxIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t('profileTitle')}
        </Typography>

        <Modal
          confirmButtonText={
            t(isDeleteLoading ? 'modal.user.deleting' : 'modal.user.confirmDelete')!
          }
          open={open}
          onClickCancel={() => {
            setOpen(false);
          }}
          onClickConfirm={handleDeleteUser}
        >
          <Box sx={{ display: 'flex' }}>
            <Warning color="error" sx={{ mr: 0.5 }} />
            <Typography>{t('modal.user.sureDeleteUser')}</Typography>
          </Box>
        </Modal>

        <InputText
          name="name"
          label={t('form.fields.name')}
          autoComplete="off"
          control={control}
          rules={rules.name}
          fullWidth
        />

        <InputText
          name="login"
          label={t('form.fields.login')}
          autoComplete="off"
          control={control}
          rules={rules.login}
          fullWidth
        />

        <InputText
          name="password"
          control={control}
          rules={rules.password}
          margin="normal"
          label={t('form.fields.newPassword')}
          type="password"
          fullWidth
          autoComplete="new-password"
        />

        <Grid container sx={{ mt: 3 }}>
          <Grid item>
            <Button size="small" color="error" onClick={() => setOpen(true)}>
              {t('auth.deleteUser')}
            </Button>
          </Grid>
          <Grid item xs textAlign={'right'}>
            <Button variant={'contained'} type="submit" disabled={!isDirty || isLoading}>
              {t('form.fields.save')} {isLoading && '...'}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Profile;
