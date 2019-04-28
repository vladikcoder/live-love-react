import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

import Registration from "./Registration";
import Confirmation from "./Confirmation";
import Login from "./Login";
import Profile from "./Profile";


// import fetch from "cross-fetch";

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
          path="/profile"
          render={props => <Profile {...props} />}
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
