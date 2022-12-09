import React, { useEffect } from 'react';
import './SignIn.scss';
import { Avatar, Button, Link, Typography, Card, CardContent } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputText from '../InputText/InputText';
import { useAppDispatch } from '../../store/redux.hooks';
import LoginIcon from '@mui/icons-material/Login';
import { showToast } from 'store/toastSlice';
import { useTranslation } from 'react-i18next';
import { rules } from '../../utils/validation.utils';
import { useSignInUserMutation } from '../../services/auth.api';

import { ISignInForm } from '../../types/types';
import { useCurrentUser } from '../../hooks/useCurrentUser';

const SignIn = () => {
  const [signInUser, { isLoading }] = useSignInUserMutation();
  const { handleSubmit, control, setError } = useForm<ISignInForm>({
    defaultValues: {
      login: '',
      password: '',
    },
  });
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loggedIn } = useCurrentUser();

  useEffect(() => {
    if (loggedIn) {
      dispatch(showToast({ message: t('auth.toast.successToSignIn'), type: 'success' }));
    }
  }, [loggedIn]);

  const onSubmit: SubmitHandler<ISignInForm> = ({ login, password }) => {
    signInUser({ login, password })
      .unwrap()
      .then(({ token }) => {
        if (token.length) {
          dispatch(showToast({ message: t('auth.toast.successToSignIn'), type: 'success' }));
        }
      })
      .catch(() => {
        setError('login', { type: 'custom', message: '' });
        setError('password', { type: 'custom', message: '' });
      });
  };

  return (
    <Card component="form" onSubmit={handleSubmit(onSubmit)} className="SignInForm">
      <CardContent className="inner">
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LoginIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t('signInTitle')}
        </Typography>
        <InputText
          name="login"
          label={t('form.fields.login')}
          autoComplete="login"
          control={control}
          rules={rules.login}
          fullWidth
        />

        <InputText
          name="password"
          control={control}
          rules={rules.password}
          margin="normal"
          label={t('form.fields.password')}
          type="password"
          fullWidth
          autoComplete="password"
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{ mb: 2, mt: 1 }}
          fullWidth
        >
          {t('auth.signIn')}
          {isLoading && '...'}
        </Button>

        <Link href="/registration" margin="normal">
          {t('auth.noAccount')}
        </Link>
      </CardContent>
    </Card>
  );
};

export default SignIn;
