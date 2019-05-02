import React, {Component} from 'react';
import { Link } from "react-router-dom";
import {connect} from 'react-redux';

import './ProfileEdit.css';
import avatarLogo from './img/avatar.png';
import emptyLogo from './img/empty.png';

class ProfileEdit extends Component {
  render() {
    let {id, name, phone} = this.props.user.profile;

    if (!id) {
      this.props.history.push('/');
    }

    return (
      <div className="ProfileEdit">
        <div className="ProfileEdit-header">
          <h3>Редактировать</h3>
          <Link to="/profile">
            <span>Done</span>
          </Link>
        </div>

        <div className="ProfileEdit-avatar-container">
          <img src={avatarLogo} alt="avatarLogo"/>
        </div>

        <div className="ProfileEdit-user-info">
          <div>
            <div className="ProfileEdit-user-info-label">
              Полное имя
            </div>
            <input type="text" placeholder="Ваше имя" value={name} />
          </div>
          <div>
            <div className="ProfileEdit-user-info-label">
              Номер Телефона
            </div>
            <input type="text" placeholder="+380" value={`+${phone}`} />
          </div>
          <div>
            <div className="ProfileEdit-user-info-label">
              Должность
            </div>
            <input type="text" />
          </div>
          <div>
            <div className="ProfileEdit-user-info-label">
              Биография
            </div>
            <textarea />
          </div>
          <div>

            <div className="ProfileEdit-user-info-label">
              Социальные сети
            </div>

            <div className="User-info-social Facebook">
              <img src={emptyLogo} alt="emptyLogo"/>
              <span className="User-info-social-label">
                Добавить Facebook
              </span>
              <span className="User-info-social-connect">
                ДОБАВИТЬ
              </span>
            </div>

            <div className="User-info-social Instagram">
              <img src={emptyLogo} alt="emptyLogo"/>
              <span className="User-info-social-label">
                Добавить Instagram
              </span>
              <span className="User-info-social-connect">
                ДОБАВИТЬ
              </span>
            </div>

            <div className="User-info-social Strava">
              <img src={emptyLogo} alt="emptyLogo"/>
              <span className="User-info-social-label">
                Добавить Strava
              </span>
              <span className="User-info-social-connect">
                ДОБАВИТЬ
              </span>
            </div>

          </div>
        </div>

      </div>
    )
  }

}

export default connect(
  state => ({
    user: {...state.user}
  }),
  dispatch => ({}),
)(ProfileEdit);