import { AvatarGroup, Avatar } from '@mui/material';
import React from 'react';
import stringToColor from 'utils/stringToColor';

const RoundUsersAvatars = ({ logins, maxCount = 4 }: { logins: string[]; maxCount?: number }) => (
  <AvatarGroup max={maxCount} sx={{ justifyContent: 'flex-end' }}>
    {logins.map((login) => (
      <Avatar
        key={login}
        alt={login}
        sx={{ backgroundColor: stringToColor(login), width: '30px', height: '30px' }}
      >
        {login[0]}
      </Avatar>
    ))}
  </AvatarGroup>
);

export default RoundUsersAvatars;
