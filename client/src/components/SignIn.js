import React, { Component } from 'react';
import { auth } from '../firebase';
import * as routes from '../constants/routes';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Navbar from './TopNav/TopNav';
import FormHelperText from '@material-ui/core/FormHelperText';
import DemoButton from './DemoButton';

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      email,
      password,
      // error
    } = this.state;

    const { history } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        history.push(routes.LANDING);
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
        console.log("Login failed");
      });

    console.log("Submit function was called.");
    event.preventDefault();
  }

  render() {
    const { classes } = this.props;

    const {
      email,
      password,
      // error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

      return (
        <React.Fragment>
          <Navbar />
          <CssBaseline />
          <main className={classes.layout}>
            <Paper className={classes.paper}>
              <Typography variant="headline">Sign in</Typography>
              <form className={classes.form} onSubmit={this.onSubmit}>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="email">Email Address</InputLabel>
                  <Input 
                    id="email"
                    name="email"
                    autoComplete="email"
                    type="email"
                    onChange={event => this.setState(byPropKey('email', event.target.value))}
                    autoFocus />
                    {this.state.error ? (
                      <FormHelperText error id="component-error-text">Invalid login</FormHelperText>
                    ) : ( <> </> )}
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    name="password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={event => this.setState(byPropKey('password', event.target.value))}
                  />
                </FormControl>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  disabled={isInvalid}
                  type="submit"
                  fullWidth
                  variant="raised"
                  color="default"
                  className={classes.submit}
                >
                  Sign in
                </Button>
                <DemoButton />
                <div style={{ marginTop: 16 }}>
                  <Link to={routes.PASSWORD_FORGET}>Lost your password?</Link>
                </div>
              </form>
            </Paper>
          </main>
        </React.Fragment>
      );
  }
}

SignInForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignInForm);

export {
  SignInForm,
};