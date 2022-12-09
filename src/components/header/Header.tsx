import {
  AppBar,
  ButtonGroup,
  Toolbar,
  Typography,
  useScrollTrigger,
  Box,
  Avatar,
  Link,
  Button,
  Tooltip,
} from '@mui/material';
import React, { useState } from 'react';
import './header.scss';
import CreateBoardModal from 'components/CreateBoardModal/CreateBoardModal';
import { signOutAction } from '../../store/userSlice';
import { useAppDispatch } from '../../store/redux.hooks';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

import { showToast } from '../../store/toastSlice';
import HeaderMenu from './Menu/Menu';
import TranslateIcon from '@mui/icons-material/Translate';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useCurrentUser } from '../../hooks/useCurrentUser';

const Header = () => {
  const user = useCurrentUser();
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleSignOut = () => {
    dispatch(signOutAction()).then(() => {
      dispatch(showToast({ type: 'success', message: t('auth.toast.signOutSuccess') }));
    });
  };
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const onClickAddBoard = () => {
    setModalOpen(true);
  };

  const userMenu = [
    { name: t('menu.signIn'), url: '/login' },
    { name: t('menu.signUp'), url: '/registration' },
  ];

  const userAuthorizedMenu = [
    { name: t('menu.goToMainPage'), url: '/boards' },
    { name: t('menu.profilePage'), url: '/profile' },
    { name: t('menu.signOut'), onClick: handleSignOut, icon: <LogoutIcon sx={{ ml: 0.5 }} /> },
  ];

  const langs = [
    { name: 'ru', onClick: () => changeLanguage('ru') },
    { name: 'en', onClick: () => changeLanguage('en') },
  ];

  const onModalClose = () => setModalOpen(false);

  return (
    <>
      <AppBar
        elevation={trigger ? 3 : 0}
        color={trigger ? 'secondary' : 'primary'}
        position="sticky"
        sx={{
          py: trigger ? 0 : 0.6,
          mb: 2,
          transition: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        }}
      >
        <Toolbar component="nav">
          <Typography
            className="logo"
            variant="h6"
            component={Link}
            href={'/'}
            color={trigger ? 'primary.contrastText' : 'secondary.contrastText'}
            sx={{ padding: '0 10px' }}
          >
            Super boards
          </Typography>
          {user.loggedIn && (
            <Button onClick={onClickAddBoard} color="inherit" sx={{ ml: 'auto' }}>
              <Typography sx={{ display: { xs: 'none', md: 'flex' } }}>
                {t('menu.addBoard')}
              </Typography>
              <Tooltip title={t('menu.addBoard')}>
                <AddCircleIcon fontSize="large" sx={{ ml: 0.5 }} />
              </Tooltip>
            </Button>
          )}

          <Box sx={{ ml: 'auto', display: 'flex' }}>
            <ButtonGroup variant={'text'}>
              <HeaderMenu
                items={user.loggedIn ? userAuthorizedMenu : userMenu}
                icon={<Avatar alt={user.name} />}
              />
            </ButtonGroup>
          </Box>
          <Box>
            <HeaderMenu
              items={langs}
              icon={<TranslateIcon sx={{ mr: 0.5 }} />}
              text={i18n.language.toUpperCase()}
              alwaysIcon={true}
            />
          </Box>
        </Toolbar>
      </AppBar>
      {modalOpen && <CreateBoardModal onModalClose={onModalClose} open={modalOpen} />}
    </>
  );
};

export default Header;
