import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const LoadingShadow = () => {
  return (
    <Box
      width={'100%'}
      height={'100%'}
      sx={{
        position: 'absolute',
        backgroundColor: '#000000',
        opacity: '50%',
        display: 'flex',
        top: 0,
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      {true && <CircularProgress size={80} sx={{ m: 'auto' }} />}
    </Box>
  );
};

export default LoadingShadow;
