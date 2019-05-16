import React from 'react';
import { Link } from "react-router-dom";
import {connect} from 'react-redux';

import {AVATAR_BASE_URL, getUserProfile} from './constsService';

import './Feed.css';

import avatarLogo from './img/avatar.png';
import feedLogo from './img/live-logo-feed.JPG';
import locationLogo from './img/location.png';
import commentsLogo from './img/comments.png';
import feedNavLogo from './img/feed.png';
import notifsNavLogo from './img/notifs.png';
import askNavLogo from './img/ask.png';
import otherNavLogo from './img/other.png';

const Feed = ({history, user, onSetProfile}) => {
  const { id, image, programs } = user.profile;

  const userDataUpdate = () => {
    let { access_token } = user;
    let { phone } = user.profile;

    getUserProfile(phone, access_token)
    .then(onSetProfile)
    .catch(console.warn)
  };

  const getTime = (time) => {
    let nextDate = new Date(time);

    let hours = (nextDate.getHours() < 10) ? (
      `0${nextDate.getHours()}`
    ) : (
      nextDate.getHours()
    );

    let minutes = (nextDate.getMinutes() < 10) ? (
      `0${nextDate.getMinutes()}`
    ) : (
      nextDate.getMinutes()
    );

    return `${hours}:${minutes}`;
  };

  const getDate = (time) => {
    let currentDate = new Date();
    let nextDate = new Date(time);
    let day, month;

    if (currentDate.getDate() === nextDate.getDate()
      && currentDate.getMonth() === nextDate.getMonth()
    ) {
      return 'Сегодня'
    }

    currentDate.setDate(currentDate.getDate() + 1);

    if (currentDate.getDate() === nextDate.getDate()
      && currentDate.getMonth() === nextDate.getMonth()
    ) {
      return 'Завтра'
    }

    if (nextDate.getDate() < 10) {
      day = `0${nextDate.getDate()}`
    } else {
      day = nextDate.getDate();
    }

    if (nextDate.getMonth() + 1 < 10) {
      month = `0${nextDate.getMonth() + 1}`
    } else {
      month = nextDate.getMonth() + 1;
    }

    return `${day}.${month}`;
  };

  if (!id) {
    history.push('/');
  }

  return (
    <div className="Feed">
      <header>
        <div className="Feed-header">
          <img src={feedLogo} alt="feed logo"/>
          <Link to="/profile">
            <div
              className="Feed-header-profile"
              onClick={() => userDataUpdate()}
            >
              <img
                alt="avatarLogo"
                className="Profile-user-avatar"
                onError={event =>{
                  event.target.src = avatarLogo
                }}
                src={image ? `${AVATAR_BASE_URL}/${image}` : avatarLogo}
              />
            </div>
          </Link>
        </div>
        <nav>
          <div className="Feed-navigation">
            <button>
              События
            </button>
            <button>
              Публикации
            </button>
          </div>
        </nav>
      </header>
      <main>
        <div className="Feed-events-wrapper">
          {
            (programs.length > 0) ? (
              programs.map(program => (
                <div
                  className="Feed-events-item"
                  key={program.title}
                >
                  <div className="Feed-events-item-header">
                    <div className="Feed-events-item-header-date">
                      <div className="Feed-events-item-header-date-time">
                        {getTime(program.next_date)}
                      </div>
                      <div className="Feed-events-item-header-date-calendary">
                        {getDate(program.next_date)}
                      </div>
                    </div>
                    <div className="Feed-events-item-header-divider"/>
                    <div className="Feed-events-item-header-title">
                      {program.title}
                    </div>
                  </div>
                  <div className="Feed-events-item-info-bar">
                    <div className="Feed-events-item-info-bar-location">
                      <img
                        src={locationLogo}
                        alt="location marker"
                      />
                      <span>
                    {program.location}
                  </span>
                    </div>
                    <div className="Feed-events-item-info-bar-comments">
                      <img
                        src={commentsLogo}
                        alt="comments logo"
                      />
                      <span>
                    {program.comments}
                  </span>
                    </div>
                  </div>
                  <div className="Feed-events-item-image-wrapper">
                    <img
                      src={program.photo}
                      alt="program logo"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div
                className="Feed-events-item"
              >
                <div className="Feed-events-nothing-message">
                    No new events for you
                </div>
              </div>
            )
          }
        </div>
      </main>
      <footer className="Feed-events-item-footer">
        <nav>
          <div className="Feed-events-item-footer-div">
            <div className="Feed-events-item-footer-nav-item">
              <img src={feedNavLogo} alt="feed logo"/>
              <p>Фид</p>
            </div>
            <div className="Feed-events-item-footer-nav-item">
              <img src={notifsNavLogo} alt="notifications logo"/>
              <p>Уведомления</p>
            </div>
            <div className="Feed-events-item-footer-nav-item">
              <img src={askNavLogo} alt="ask logo"/>
              <p>Спросить</p>
            </div>
            <div className="Feed-events-item-footer-nav-item">
              <img src={otherNavLogo} alt="other logo"/>
              <p>Другое</p>
            </div>
          </div>
        </nav>
      </footer>
    </div>
  )
};

export default connect(
  state => ({
    user: {...state.user}
  }),
  dispatch => ({
    onSetProfile: (profile) => {
      dispatch({type: 'SET_PROFILE', payload: profile});
    }
  }),
)(Feed);