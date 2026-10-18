import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import MainPage from './components/Page/MainPage';
import SignUpPage from './components/SignUp';
import SignInPage from './components/SignIn';
import PasswordForgetPage from './components/PasswordForget';
import AccountPage from './components/Account';
import withAuthentication from './components/withAuthentication';
import * as routes from './constants/routes';

const App = () =>
  <Router>
    <>
      <Route exact path={routes.LANDING} component={MainPage} />
      <Route exact path={routes.SIGN_UP} component={SignUpPage} />
      <Route exact path={routes.SIGN_IN} component={SignInPage} />
      <Route exact path={routes.PASSWORD_FORGET} component={PasswordForgetPage} />
      <Route exact path={routes.ACCOUNT} component={AccountPage} />
    </>
  </Router>

export default withAuthentication(App);
