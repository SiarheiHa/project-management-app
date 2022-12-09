import Board from 'pages/board/Board';
import Boards from 'pages/boards/Boards';
import Layout from 'pages/layout/Layout';
import MainPage from 'pages/mainPage/MainPage';
import NotFound from 'pages/notFound/NotFound';
import Profile from 'pages/profile/Profile';
import SignIn from 'pages/signIn/SignIn';
import SignUp from 'pages/signUp/SignUp';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LoadingBackdrop from './components/LoadingBackdrop/LoadingBackdrop';
import { useCurrentUser } from './hooks/useCurrentUser';
import { useTranslation } from 'react-i18next';

function App() {
  const { isLoading, loggedIn } = useCurrentUser();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    document.title = t('title');
  }, [i18n.language]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route
            element={isLoading ? <LoadingBackdrop /> : <ProtectedRoute isAllowed={loggedIn} />}
          >
            <Route path="boards" element={<Boards />} />
            <Route path="boards/:id" element={<Board />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route
            element={
              isLoading ? (
                <LoadingBackdrop />
              ) : (
                <ProtectedRoute isAllowed={!loggedIn} redirectPath={'/boards'} />
              )
            }
          >
            <Route path="login" element={<SignIn />} />
            <Route path="registration" element={<SignUp />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
