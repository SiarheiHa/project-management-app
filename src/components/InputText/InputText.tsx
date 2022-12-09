import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField/TextField';
import { TextField } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

const InputText = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  props: UseControllerProps<TFieldValues, TName> & TextFieldProps
) => {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  const { t } = useTranslation();

  const { size, margin, fullWidth, ...rest } = props;
  return (
    <TextField
      {...field}
      error={!!error}
      helperText={error && error.message && t(error.message)}
      size={size ?? 'medium'}
      fullWidth={fullWidth === undefined ? true : fullWidth}
      margin={margin ?? 'normal'}
      {...rest}
    />
  );
};

export default InputText;
