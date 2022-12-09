import { Avatar, Box, Button, Card, Divider, Grid, Link, Typography } from '@mui/material';
import React from 'react';
import { responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import './mainPage.scss';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { theme } from 'index';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function MainPage(): JSX.Element {
  const welcomePageTheme = responsiveFontSizes(theme);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useCurrentUser();

  const developers = [
    {
      url: 'https://github.com/khanamiryan',
      name: t('developers.ashot'),
      imageSrc: 'https://avatars.githubusercontent.com/u/6542341?s=256&v=4',
      role: `${t('developers.lead')}, ${t('developers.developer')}`,
    },
    {
      url: 'https://github.com/utyfjs',
      name: t('developers.henadzi'),
      imageSrc: '/assets/jpg/henadzi.jpg',
      role: t('developers.developer'),
    },
    {
      url: 'https://github.com/siarheiha',
      name: t('developers.siarhei'),
      imageSrc: '/assets/jpg/siarhei.jpg',
      role: t('developers.developer'),
    },
  ];

  return (
    <ThemeProvider theme={welcomePageTheme}>
      <Grid container spacing={2} justifyContent="center">
        <Grid
          item
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-evenly"
          xs={12}
          sm={6}
          md={6}
        >
          <Box>
            <Typography variant="h2" textAlign="center">
              SuperBoards
            </Typography>
            <Typography variant="h4" textAlign="center">
              {t('welcom.slogan')}
            </Typography>
          </Box>
          {!user.loggedIn && (
            <Box textAlign={'center'}>
              <Button
                variant="outlined"
                sx={{ m: 1, minWidth: '150px' }}
                onClick={() => navigate('/login')}
              >
                {t('menu.signIn')}
              </Button>
              <Button
                variant="contained"
                sx={{ m: 1, minWidth: '150px' }}
                onClick={() => navigate('/registration')}
              >
                {t('menu.signUp')}
              </Button>
            </Box>
          )}
        </Grid>
        <Grid
          item
          xs={8}
          sm={4}
          md={4}
          component="img"
          src="/assets/jpg/goal_800.jpg"
          alt="goal"
          height="auto"
        ></Grid>
      </Grid>

      <Divider />

      {/* section 2 */}

      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems={'stretch'}
        flexWrap="wrap-reverse"
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          component="img"
          src="/assets/jpg/board_4_800.jpg"
          alt="board"
        ></Grid>
        <Grid
          item
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-evenly"
          xs={12}
          sm={6}
          md={6}
        >
          <Typography
            variant="h5"
            component="p"
            sx={{ textAlign: { xs: 'center', sm: 'justify' } }}
          >
            {t('welcom.firstTextBlock')}
          </Typography>
          <Divider />
          <Typography
            variant="body1"
            component="p"
            color={'text.secondary'}
            sx={{ textAlign: { xs: 'center', sm: 'justify' } }}
          >
            {t('welcom.footnote')}
          </Typography>
        </Grid>
      </Grid>

      <Divider />

      {/* section 3 */}

      <Grid container spacing={2} justifyContent="center" alignItems={'center'}>
        <Grid item xs={12} sm={6} md={6}>
          <Typography
            variant="h5"
            component="p"
            sx={{ textAlign: { xs: 'center', sm: 'justify' } }}
          >
            {t('welcom.secondTextBlock')}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          component="img"
          src="/assets/jpg/board_3_800.jpg"
          alt="board"
        ></Grid>
      </Grid>

      <Divider sx={{ mt: 2, mb: 2 }} />

      {/* section 4 */}
      <Box>
        <Typography variant="h4" textAlign={'center'} sx={{ m: 4 }}>
          {t('welcom.developers')}
        </Typography>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems={'center'}
          flexWrap="wrap-reverse"
        >
          {developers.map(({ name, role, imageSrc, url }) => {
            return (
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                key={name}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: '280px',
                    p: 4,
                  }}
                >
                  <Avatar
                    alt="photo"
                    src={imageSrc}
                    sx={{ width: 200, height: 200 }}
                    variant="rounded"
                  />
                  <Typography variant="h4">{name.split(' ')[0]}</Typography>
                  <Typography variant="h6" component={'p'} color="text.secondary">
                    {role}
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Divider sx={{ mt: 2, mb: 2 }} />

        <Typography variant="h6" component={'p'} textAlign="center">
          {t('welcom.schoolInfoFirstPart')}
          {
            <Link href="https://rs.school/react/" target="_blank">
              {t('welcom.schoolInfoSecondPart')}
            </Link>
          }
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
