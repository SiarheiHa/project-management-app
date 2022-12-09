export type ModalProps = {
  open: boolean;
  children: JSX.Element | string;
  title?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onlyConfirmButton?: boolean;
  onClickConfirm: () => void;
  onClickCancel?: () => void;
};
