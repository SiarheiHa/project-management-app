import React from 'react';
import './Toast.styles.scss';
import { Alert, Snackbar } from '@mui/material';
import { hideToast, ToastState } from 'store/toastSlice';
import { useAppDispatch } from 'store/redux.hooks';

const Toast = ({ open, message, type = 'error' }: ToastState) => {
  const dispatch = useAppDispatch();
  const onClose = () => dispatch(hideToast());

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert elevation={6} variant="filled" severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
