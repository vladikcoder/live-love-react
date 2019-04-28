import React, {Component} from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./Profile.css";
import "./checkbox.css";
import liveLogo from "./img/live-logo.jpg";

class Profile extends Component {

  render() {
    if (!this.props.user.profile.id) {
      this.props.history.push("/");
    }

    return (
      <div className="Profile">
        <img className="Profile-live-logo" src={liveLogo} alt="app-logo" />

        <h1 className="Profile-please-label">
          Profile
        </h1>

      </div>
    );
  }


};

export default connect(
  state => ({
    user: {...state.user}
  }),
  dispatch => ({}),
)(Profile);