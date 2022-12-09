import React from 'react';
import './signIn.scss';
import SignIn from '../../components/SignIn/SignIn';

export default function SignInRoute() {
  return (
    <>
      {<SignIn />}
      {/*{loggedIn ? <h3>You are already logged in</h3> : <SignIn />}*/}
    </>
  );
}
