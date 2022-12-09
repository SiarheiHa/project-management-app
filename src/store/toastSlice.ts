import { AlertColor } from '@mui/material';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ToastState = {
  open: boolean;
  message: string;
  type?: AlertColor;
};

const initialToastState: ToastState = {
  open: false,
  type: 'error',
  message: '',
};

const toastSlice = createSlice({
  name: 'toast',
  initialState: initialToastState,
  reducers: {
    showToast: (state: ToastState, action: PayloadAction<Omit<ToastState, 'open'>>) => {
      state.message = action.payload.message;
      state.type = action.payload.type || 'error';
      state.open = true;
    },
    hideToast: (state: ToastState) => {
      state.open = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
