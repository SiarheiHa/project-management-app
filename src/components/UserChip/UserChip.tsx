import React from 'react';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import FaceIcon from '@mui/icons-material/Face';
import { Chip } from '@mui/material';

const UserChip = ({ isOwner = false, login }: { isOwner?: boolean; login: string }) => {
  return (
    <Chip
      icon={isOwner ? <FaceRetouchingNaturalIcon /> : <FaceIcon />}
      label={login}
      color="primary"
      variant="outlined"
    />
  );
};

export default UserChip;
