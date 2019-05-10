import React, {Component} from 'react';
import { Link } from "react-router-dom";
import {connect} from 'react-redux';

import './Profile.css';
import avatarLogo from './img/avatar.png';
import emptyLogo from './img/empty.png';
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
    let baseURL = 'http://ll.jdev.com.ua/storage';
    let {id, name, phone, image, programs, facebook, instagram, strava} = this.props.user.profile;

    if (!id) {
      this.props.history.push('/');
    }

    return (
      <div className="Profile">
        <div className="Profile-fade-header">
          <Link to="/feed">
            <span>×</span>
          </Link>
        </div>

        {
          (image instanceof File) ? (
            <p>loading ...</p>
          ) : (
            <img
              alt="avatarLogo"
              className="Profile-user-avatar"
              onError={event =>{
                event.target.src = avatarLogo
              }}
              src={image ? `${baseURL}/${image}` : avatarLogo}
            />
          )
        }

        <p className="Profile-user-name">
          {name}
        </p>
        <p className="Profile-user-phone">{this.formatPhone(phone)}</p>

        <div className="Profile-nav">
          <div className="Profile-nav-item">
              {facebook ? (
                <a href={facebook}>
                  <div className="Profile-nav-logo-wrapper">
                    <img
                      src={facebookLogo}
                      alt="facebookLogo"
                    />
                  </div>
                </a>
              ) : (
                <div className="Profile-nav-logo-wrapper">
                  <img
                    src={emptyLogo}
                    alt="facebookLogo"
                  />
                </div>
              )}
            <p>Facebook</p>
          </div>
          <div className="Profile-nav-item">
              {instagram ? (
                <a href={instagram}>
                  <div className="Profile-nav-logo-wrapper">
                      <img
                        src={instagramLogo}
                        alt="instagramLogo"
                      />
                  </div>
                </a>
              ) : (
                <div className="Profile-nav-logo-wrapper">
                  <img
                    src={emptyLogo}
                    alt="instagramLogo"
                  />
                </div>
              )}
            <p>Instagram</p>
          </div>
          <div className="Profile-nav-item">

              {strava ? (
                <a href={strava}>
                  <div className="Profile-nav-logo-wrapper">
                    <img
                      src={stravaLogo}
                      alt="stravaLogo"
                    />
                  </div>
                </a>
              ) : (
                <div className="Profile-nav-logo-wrapper">
                  <img
                    src={emptyLogo}
                    alt="stravaLogo"
                  />
                </div>
              )}

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
            </Link>
            <p>Изменить</p>
          </div>
        </div>

        <div className="Profile-programs">
            <div className="Profile-programs-current-container">
              <p className="Profile-programs-title">
                Мои программы
              </p>

              {(programs.length) ? (
                programs.map(program => (
                  <div
                    className="Profile-programs-current-item"
                    key={program.title}
                  >
                    <p className="Profile-programs-item-title">
                      {program.title}
                    </p>

                    <div className="Profile-programs-item-status-bar">
                      <div className="status-bar-duration">
                        <img
                          src={clockLogo}
                          alt="clockLogo"
                        />
                        <span>
                    {program.duration}
                  </span>
                      </div>
                      <div className="status-bar-participants">
                        <img
                          src={peopleLogo}
                          alt="peopleLogo"
                        />
                        <span>
                    {program.participants}
                  </span>
                      </div>
                    </div>

                    {program.photo && (
                      <div className="Profile-programs-current-item-photo-wrapper">
                        <img src={program.photo} alt="program logo"/>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div
                  className="Profile-programs-current-item"
                >
                  <p className="Profile-programs-none-title">
                    Активных программ не добавлено
                  </p>
                </div>
              )}

            </div>

          {(programs.filter(item => item.done).length > 0) && (
            <div className="Profile-programs-done-container">
              <p className="Profile-programs-title">
                Пройденные
              </p>

              {programs.filter(item => item.done).map(doneProgram => (
                <div
                  className="Profile-programs-current-item"
                  key={doneProgram.title}
                >
                  <div className="Profile-programs-done-cover" />
                  <p className="Profile-programs-item-title">
                    {doneProgram.title}
                  </p>

                  <div className="Profile-programs-item-status-bar">
                    <div className="status-bar-duration">
                      <img
                        src={clockLogo}
                        alt="clockLogo"
                      />
                      <span>
                        {doneProgram.duration}
                  </span>
                    </div>
                    <div className="status-bar-participants">
                      <img
                        src={peopleLogo}
                        alt="peopleLogo"
                      />
                      <span>
                    {doneProgram.participants}
                  </span>
                    </div>
                  </div>

                  {doneProgram.photo && (
                    <div className="Profile-programs-current-item-photo-wrapper">
                      <img src={doneProgram.photo} alt="program logo"/>
                    </div>
                  )}
                </div>
              ))
              }

            </div>
          )}
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