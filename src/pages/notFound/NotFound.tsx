import React from 'react';
import './notFound.scss';
import { useTranslation } from 'react-i18next';

export default function NotFoundRoute(): JSX.Element {
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('pageNotFound')}</h2>
    </>
  );
}
