import Footer from 'components/footer';
import Header from 'components/header';
import Toast from 'components/Toast/Toast';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from 'store/redux.hooks';
import './layout.scss';
import { Container, CssBaseline, Drawer } from '@mui/material';
import { Box } from '@mui/system';

export default function Layout(): JSX.Element {
  const state = useAppSelector((state) => state.toast);

  return (
    <Box className="layout">
      <CssBaseline enableColorScheme />
      <Header />
      <Container component="main" className="main">
        <Outlet />
      </Container>
      <Toast {...state} />
      <Footer />
    </Box>
  );
}
