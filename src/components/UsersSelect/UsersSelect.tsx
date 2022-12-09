import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

import { useGetUsersQuery } from 'services/users.api';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { IUserInfo } from '../../types/types';

type UsersSelectProps = {
  selectedUsersId?: string[];
  usersIdForSelection?: string[];
  onUserSelect: (logins: string[]) => void;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const getUserIdByLogin = (login: string, users: IUserInfo[]) => {
  return users.find((user) => user.login === login)?.id;
};

export default function UsersSelect({
  selectedUsersId = [],
  usersIdForSelection = [],
  onUserSelect,
}: UsersSelectProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data: users, isSuccess } = useGetUsersQuery('');

  const [personName, setPersonName] = useState<string[]>([]);
  const { id: currentUserId } = useCurrentUser();

  useEffect(() => {
    if (isSuccess && selectedUsersId.length) {
      const selectedNames = users
        ? selectedUsersId.reduce((acc: string[], selectedUserID) => {
            const name = users.find(({ id }) => id === selectedUserID)?.name;
            if (name) {
              acc = [...acc, name];
            }
            return acc;
          }, [])
        : [];
      setPersonName(selectedNames);
    }
  }, [isSuccess, selectedUsersId, users]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );

    if (typeof value === 'string' && users?.length) {
      onUserSelect(value.split(',').map((login) => getUserIdByLogin(login, users)) as string[]);
    } else if (Array.isArray(value) && users?.length) {
      onUserSelect(value.map((login) => getUserIdByLogin(login, users)) as string[]);
    }
  };

  return (
    <FormControl sx={{ m: 0, width: '100%' }}>
      <InputLabel id="demo-multiple-chip-label">{t('modal.board.share')}</InputLabel>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={personName}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {users &&
          users.map(({ id, login }) => {
            // when creating a task, the owner is available for selection, but not when creating a board
            if (id === currentUserId && !usersIdForSelection.length) {
              return null;
            }
            if (usersIdForSelection.length && !usersIdForSelection.includes(id)) {
              return null;
            }
            return (
              <MenuItem key={id} value={login} style={getStyles(id, personName, theme)}>
                {login}
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
}
