import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

import Registration from "./components/Registration";
import Confirmation from "./components/Confirmation";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ProfileEdit from "./components/ProfileEdit";
import Feed from "./components/Feed";

class App extends Component {

  render() {
    console.log(this.props.user);

    return (
      <Switch>
        <Route exact path="/" render={props => <Login {...props} />} />
        <Route path="/register" render={props => <Registration {...props} />} />
        <Route
          path="/confirm"
          render={props => <Confirmation {...props} />}
        />
        <Route
          exact path="/profile"
          render={props => <Profile {...props} />}
        />
        <Route
          path="/profile/edit"
          render={props => <ProfileEdit {...props} />}
        />
        <Route
          path="/feed"
          render={props => <Feed {...props} />}
        />
      </Switch>
    );
  }
}

export default connect(
  state => ({
    user: {...state.user}
  }),
  dispatch => ({}),
)(App);
