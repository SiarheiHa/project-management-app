import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ModalProps } from './Modal.types';
import { useTranslation } from 'react-i18next';

export default function Modal({
  open,
  children,
  title,
  confirmButtonText,
  cancelButtonText,
  onlyConfirmButton,
  onClickConfirm,
  onClickCancel,
}: ModalProps) {
  const { t } = useTranslation();
  const content =
    typeof children === 'string' ? (
      <DialogContentText id="alert-dialog-description">{children}</DialogContentText>
    ) : (
      children
    );

  return (
    <Dialog
      open={open}
      onClose={onClickCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="modal"
    >
      {title && (
        <DialogTitle id="alert-dialog-title" overflow={'auto'}>
          {title}
        </DialogTitle>
      )}
      <DialogContent sx={{ overflowY: 'initial' }}>{content}</DialogContent>
      <DialogActions>
        {!onlyConfirmButton && (
          <Button onClick={onClickCancel}>{cancelButtonText || t('modal.cancel')}</Button>
        )}
        <Button onClick={onClickConfirm} autoFocus>
          {confirmButtonText || t('modal.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
