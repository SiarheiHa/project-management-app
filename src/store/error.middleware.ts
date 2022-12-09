import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit';
import { showToast } from './toastSlice';
import { signOut } from '../utils/signOut';
import i18n from '../i18n';

export const rtkErrorMiddleware: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    if (action.payload.status === 403 && action.payload.data.statusCode === 403) {
      signOut(api.dispatch);
    }
    if (action.payload.status) {
      api.dispatch(
        showToast({
          message: i18n.t([`serverError.${action.payload.status}`, 'serverError.unspecific']),
        })
      );
    }
  }
  return next(action);
};
