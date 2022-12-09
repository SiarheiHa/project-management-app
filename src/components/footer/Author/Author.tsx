import { Avatar, Typography } from '@mui/material';
import React from 'react';
import './author.scss';
type AuthorType = {
  name: string;
  imageSrc: string;
  url: string;
};
const Author = ({ name, imageSrc, url }: AuthorType) => {
  return (
    <a href={url} target="_blank" className="author-link" rel="noreferrer">
      <Avatar
        alt={name}
        src={imageSrc}
        sx={{ mr: { md: 1 }, width: { xs: 24, md: 32 }, height: { xs: 24, md: 32 } }}
      />

      <Typography className="developer-name" display={{ xs: 'none', md: 'block' }}>
        {name}
      </Typography>
    </a>
  );
};

export default Author;
