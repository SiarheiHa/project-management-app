import BoardsList from 'components/boardsList/BoardsList';
import React from 'react';
import './boards.scss';

import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function Boards(): JSX.Element {
  const { isLoading, name } = useCurrentUser();
  const { t } = useTranslation();
  return (
    <>
      <h2>{isLoading ? '...' : t('welcome', { name })}</h2>
      <BoardsList />
    </>
  );
}
