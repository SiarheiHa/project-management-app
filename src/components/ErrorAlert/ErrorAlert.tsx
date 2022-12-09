import CachedIcon from '@mui/icons-material/Cached';
import { Alert, IconButton } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ErrorAlert = () => {
  const { t } = useTranslation();

  return (
    <Alert variant="outlined" severity="error" sx={{ alignItems: 'center' }}>
      {t('boards.serverError')}{' '}
      {
        <IconButton onClick={() => window.location.reload()}>
          <CachedIcon fontSize="large" />
        </IconButton>
      }
    </Alert>
  );
};

export default ErrorAlert;
