import React from 'react';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { auth } from '../firebase';
import * as routes from '../constants/routes';
import { DEMO_EMAIL, DEMO_PASSWORD } from '../utils/localStore';

// One-click sign in to the seeded demo account for portfolio visitors.
const DemoButton = ({ history }) =>
  <div style={{ marginTop: 16 }}>
    <Button
      fullWidth
      variant="contained"
      color="primary"
      onClick={() =>
        auth.doSignInWithEmailAndPassword(DEMO_EMAIL, DEMO_PASSWORD)
          .then(() => history.push(routes.LANDING))
      }
    >
      Try the demo
    </Button>
    <Typography variant="caption" style={{ marginTop: 8 }}>
      Notes are saved in your browser only.
    </Typography>
  </div>

export default withRouter(DemoButton);
