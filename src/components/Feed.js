import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import {connect} from 'react-redux';
import pullToRefresh from 'mobile-pull-to-refresh'
import ptrAnimatesMaterial from 'mobile-pull-to-refresh/dist/styles/material/animates'

import {onSetProfile} from '../store/actions';
import {AVATAR_BASE_URL, getUserProfile} from '../constsService';

import 'mobile-pull-to-refresh/dist/styles/material/style.css'
import './styles/Feed.css';

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

  useEffect(() => {
    pullToRefresh({
      container: document.querySelector('.Feed'),
      animates: ptrAnimatesMaterial,
      refresh() {
        return new Promise(resolve => {
          setTimeout(() => userDataUpdate(resolve), 2000)
        })
      }
    });
  });

  const userDataUpdate = (resolve) => {
    let access_token = localStorage.getItem('access_token');

    getUserProfile(access_token)
    .then(() => {
      onSetProfile();

      if (resolve) {
        resolve();
      }
    })
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
    <div className="Feed ">
      <div className="pull-to-refresh-material__control">
        <svg className="pull-to-refresh-material__icon" fill="#4285f4" width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>

        <svg className="pull-to-refresh-material__spinner" width="24" height="24" viewBox="25 25 50 50">
          <circle className="pull-to-refresh-material__path" cx="50" cy="50" r="20" fill="none" stroke="#4285f4"/>
        </svg>
      </div>
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

const mapStateToProps = state => {
  return {
    user: {...state.user}
  }
};

const mapDispatchToProps = {
  onSetProfile
};

export default connect(mapStateToProps, mapDispatchToProps)(Feed);