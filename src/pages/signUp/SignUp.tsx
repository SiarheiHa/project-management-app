import React from 'react';
import './signUp.scss';
import SignUp from '../../components/SignUp/SignUp';
import { useTranslation } from 'react-i18next';

export default function SignUpRoute(): JSX.Element {
  const { t } = useTranslation();
  return (
    <>
      <SignUp />
    </>
  );
}
