import React from 'react';
import Navbar from '../TopNav/TopNav';
import { withStyles } from '@material-ui/core/styles';
import LeftDrawer from '../LeftDrawer/LeftDrawer'
import RightDrawer from '../RightDrawer/RightDrawer';
import Grid from '@material-ui/core/Grid';
import Content from '../Content/Content';
import DeleteAlert from '../DeleteAlert/DeleteAlert';

// import Typography from '@material-ui/core/Typography';
// import AuthUserContext from '../AuthUserContext';
// import SignInPage from '../SignIn';
// import SignUpPage from '../SignUp';
// import { firebase } from '../../firebase';

const styles = {
  root: {
    flexGrow: 1
  },
  appFrame: {
    height: '100vh', // Important
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    // display: 'flex',
    width: '100%'
  }
}

class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // authUser: null,
      leftOpen: true,
      rightOpen: false,
      selectedNoteID: null,
      selectedNoteBody: null,
      deleteAlertOpen: false

    };
  }

  // componentDidMount() {
  //   this.handleSelectedNote();
  // }

  handleLeftDrawer = () => {
    this.setState({
      leftOpen: !this.state.leftOpen
    });
  };

  handleRightDrawer = () => {
    this.setState({
      rightOpen: !this.state.rightOpen
    })
  }

  // handleSelectedNote = (body) => {
  //   console.log(body);

  //   this.setState({
  //     selectedNote: body
  //   })
  // }

  handleSelectedNote = (id, content) => {
    // console.log(id);
    // console.log(content);
    console.log(`Selected note function fired in Mainpage. Setting state for selected note:\n id: ${id} \n content: ${content}`);

    this.setState({
      selectedNoteID: id,
      selectedNoteBody: content
    })
    console.log(this.state.selectedNoteID + "\n" + this.state.selectedNoteBody)
  }

  handleDeleteAlert = () => {
    console.log("Delete alert function fired.");
    this.setState({
      deleteAlertOpen: true
    })
  }

  handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ deleteAlertOpen: false });
  };

  // componentDidMount() {
  //   firebase.auth.onAuthStateChanged(authUser => {
  //     authUser
  //       ? this.setState({ authUser })
  //       : this.setState({ authUser: null });
  //   });
  // }

  render() {
    const { classes } = this.props;
    console.log('these are the props ===============>',this.props);
    

    return(
      <>        
        <div className={classes.root} style={this.props.style}>
          <div className={classes.appFrame}>
            <Navbar
              leftOpen={this.state.leftOpen}
              rightOpen={this.state.rightOpen}
              handleLeftDrawer={this.handleLeftDrawer}
              handleRightDrawer={this.handleRightDrawer}
            />
            <DeleteAlert
              deleteAlertOpen={this.state.deleteAlertOpen}
              handleAlertClose={this.handleAlertClose}
            />
            <Grid container>
              <Grid item md={2}>
                <LeftDrawer
                  leftOpen={this.state.leftOpen}
                  handleLeftDrawer={this.handleLeftDrawer}
                  handleSelectedNote={this.handleSelectedNote}
                  handleDeleteAlert={this.handleDeleteAlert}
                />
              </Grid>

              <Grid item md={8}>
                <main>
                  <Content
                    selectedNoteID={this.state.selectedNoteID}
                    selectedNoteBody={this.state.selectedNoteBody}
                  />
                </main>
              </Grid>

              <Grid item md={2}>
                <RightDrawer
                  rightOpen={this.state.rightOpen}
                  handleRightDrawer={this.handleRightDrawer}
                />
              </Grid>
            </Grid>
          </div>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(MainPage);