import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import Registration from "./Registration";
import RegConfirmation from "./RegConfirmation";
import Login from "./Login";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={props => <Login {...props} />} />
        <Route path="/register" render={props => <Registration {...props} />} />
        <Route
          path="/confirmation"
          render={props => <RegConfirmation {...props} />}
        />
      </Switch>
    );
  }
}

export default App;
