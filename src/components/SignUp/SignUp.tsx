import React from 'react';
import './SignUp.scss';
import { Button, Link, Card, CardContent, Avatar, Typography } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputText from '../InputText/InputText';

import { useAppDispatch } from '../../store/redux.hooks';

import { rules } from '../../utils/validation.utils';
import { useTranslation } from 'react-i18next';
import { useSignUpUserMutation } from '../../services/auth.api';
import { showToast } from '../../store/toastSlice';
import { ISignUpForm } from '../../types/types';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const SignUp = () => {
  const { handleSubmit, control, setError } = useForm<ISignUpForm>({
    defaultValues: {
      name: '',
      login: '',
      password: '',
    },
  });

  const [signUpUser, { isLoading }] = useSignUpUserMutation();

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<ISignUpForm> = async (data) => {
    await signUpUser(data)
      .unwrap()
      .then(({ login }) => {
        if (login.length) {
          dispatch(showToast({ message: t('auth.toast.successToSignUp'), type: 'success' }));
        }
      })
      .catch(() => {
        setError('name', { type: 'custom', message: '' });
        setError('login', { type: 'custom', message: '' });
        setError('password', { type: 'custom', message: '' });
      });
  };
  const { t } = useTranslation();
  return (
    <Card component="form" className="SignUpForm" onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="inner">
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <HowToRegIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t('signUpTitle')}
        </Typography>{' '}
        <InputText
          control={control}
          margin="normal"
          label={t('form.fields.name')}
          name="name"
          autoComplete="name"
          autoFocus
          rules={rules.name}
          fullWidth
        />
        <InputText
          control={control}
          margin="normal"
          label={t('form.fields.login')}
          name="login"
          autoComplete="login"
          rules={rules.login}
          fullWidth
        />
        <InputText
          control={control}
          margin="normal"
          name="password"
          label={t('form.fields.password')}
          type="password"
          autoComplete="current-password"
          rules={rules.password}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{ mb: 2, mt: 1 }}
          fullWidth
        >
          {t('auth.signup')} {isLoading && '...'}
        </Button>
        <div>
          <Link href="/login" margin="normal">
            {t('auth.haveAccount')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUp;
