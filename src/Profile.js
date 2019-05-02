import React, {Component} from 'react';
import { Link } from "react-router-dom";
import {connect} from 'react-redux';

import './Profile.css';
import avatarLogo from './img/avatar.png';
import facebookLogo from './img/fb.png';
import instagramLogo from './img/inst.png';
import stravaLogo from './img/strava.png';
import editLogo from './img/edit.png';
import clockLogo from './img/clock.png';
import peopleLogo from './img/people.png';


class Profile extends Component {
  formatPhone(phone) {
    return `+${phone.slice(0, 3)} (${phone.slice(3, 5)}) ${phone.slice(5, 8)} ${phone.slice(8, 10)} ${phone.slice(10, 12)}`;
  }

  render() {
    let {id, name, phone} = this.props.user.profile;

    if (!id) {
      this.props.history.push('/');
    }

    return (
      <div className="Profile">
        <div className="Profile-fade-header">
          <span>×</span>
        </div>

        <img
          className="Profile-user-avatar"
          src={avatarLogo}
          alt="user-avatar"
        />

        <p className="Profile-user-name">
          {name}, 34
        </p>
        <p className="Profile-user-phone">{this.formatPhone(phone)}</p>

        <div className="Profile-nav">
          <div className="Profile-nav-item">
            <div className="Profile-nav-logo-wrapper">
              <img
                src={facebookLogo}
                alt="facebookLogo"
              />
            </div>
            <p>Facebook</p>
          </div>
          <div className="Profile-nav-item">
            <div className="Profile-nav-logo-wrapper">
              <img
                src={instagramLogo}
                alt="instagramLogo"
              />
            </div>
            <p>Instagram</p>
          </div>
          <div className="Profile-nav-item">
            <div className="Profile-nav-logo-wrapper">
              <img
                src={stravaLogo}
                alt="stravaLogo"
              />
            </div>
            <p>Strava</p>
          </div>
          <div className="Profile-nav-divider" />
          <div className="Profile-nav-item">
            <Link to="profile/edit">
              <div className="Profile-nav-edit-logo-wrapper">
                <img
                  src={editLogo}
                  alt="editLogo"
                />
              </div>
              <p>Изменить</p>
            </Link>
          </div>
        </div>

        <div className="Profile-programs">
          <div className="Profile-programs-current-container">
            <p className="Profile-programs-title">
              Мои программы
            </p>

            <div className="Profile-programs-current-item">
              <p className="Profile-programs-item-title">
                Проплыви свой первый километр
              </p>
              
              <div className="Profile-programs-item-status-bar">
                <div className="status-bar-duration">
                  <img
                    src={clockLogo}
                    alt="clockLogo"
                  />
                  <span>
                    12 недель
                  </span>
                </div>
                <div className="status-bar-participants">
                  <img
                    src={peopleLogo}
                    alt="peopleLogo"
                  />
                  <span>
                    16 участников
                  </span>
                </div>
              </div>

              <img src="" alt=""/>
            </div>
          </div>

          <div className="Profile-programs-done-container">
            <p className="Profile-programs-title">
              Пройденные
            </p>

            <div className="Profile-programs-current-item">
              <div className="Profile-programs-done-cover" />
              <p className="Profile-programs-item-title">
                Проплыви свой первый километр
              </p>

              <div className="Profile-programs-item-status-bar">
                <div className="status-bar-duration">
                  <img
                    src={clockLogo}
                    alt="clockLogo"
                  />
                  <span>
                    12 недель
                  </span>
                </div>
                <div className="status-bar-participants">
                  <img
                    src={peopleLogo}
                    alt="peopleLogo"
                  />
                  <span>
                    16 участников
                  </span>
                </div>
              </div>

              <img src="" alt=""/>
            </div>

          </div>
        </div>
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