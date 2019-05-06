import React, {Component} from 'react';
// import { Link } from "react-router-dom";
import {connect} from 'react-redux';

import './ProfileEdit.css';
import avatarLogo from './img/avatar.png';
import emptyLogo from './img/empty.png';
import fetch from "cross-fetch";

class ProfileEdit extends Component {
  state = {
    localProfile: {
      "id":"",
      "name":"",
      "phone":"",
      "created_at":"",
      "updated_at":"",
      "position":"",
      "biography":"",
      "programs":[],
      "image": null
    },

    charCount: ''
  };

  componentDidMount() {
    let { profile } = this.props.user;

    this.setState({
      localProfile: {...profile},
      charCount: (profile.biography) ? 1000 - profile.biography.length : 1000
    });

    this.imageUploader();
  }

  editUpdater() {
    let {id, name, phone, biography, position } = this.state.localProfile;
    let { access_token } = this.props.user;

    if (this.isAnyChangesMade()) {
      console.log('fetching...');
      fetch(`http://ll.jdev.com.ua/api/users/edit/${id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        method: 'POST',
        body: JSON.stringify({ name, phone, biography, position })
      })
      .then(response => {
        if (response.ok) {
          this.props.onSetProfile(this.state.localProfile);
          this.props.history.push('/profile');
        }
      })
      .catch(console.warn);
    } else {
      console.log('no changes');
      this.props.history.push('/profile')
    }
  }

  isAnyChangesMade() {
    let editableFields = ['name', 'phone', 'biography', 'position', 'image'];
    let { localProfile } = this.state;
    let { profile } = this.props.user;

    for (let field of editableFields) {
      if (localProfile[field] !== profile[field]) {
        console.log('Changes on: ', field);
        return true;
      }
    }

    console.log('AnyChangesNotMade');
    return false;
  }

  inputChangeHandler(event, field) {
    let {value} = event.target;

    this.setState(prevState => {
      let newProfile = {...prevState.localProfile};

      if (field === 'phone') {
        newProfile[field] = value.slice(1);
      } else {
        newProfile[field] = value;
      }

      if (field === 'biography') {
        return {
          charCount: 1000 - value.length,
          localProfile: newProfile
        }
      }

      return {
        localProfile: newProfile
      }
    })
  }

  getCharCountStyle(charCount) {
    return {
      color: (charCount > 0) ? (
        'rgb(199, 199, 204)'
      ) : (
        'rgb(211, 49, 60)'
      )
    }
  }

  imageUploader() {
    let setState = this.setState.bind(this);
    var Imgur;

    (function (root, factory) {
      if (typeof exports === 'object') {
        module.exports = factory();
      } else {
        root.Imgur = factory();
      }
    }(this, function () {
      Imgur = function (options) {
        if (!this || !(this instanceof Imgur)) {
          return new Imgur(options);
        }

        if (!options) {
          options = {};
        }

        this.clientid = options.clientid;
        this.endpoint = 'https://api.imgur.com/3/image';
        this.callback = options.callback || undefined;
        this.dropzone = document.querySelectorAll('.dropzone');

        this.run();
      };

      Imgur.prototype = {
        createEls: function (name, props, text) {
          var el = document.createElement(name), p;
          for (p in props) {
            if (props.hasOwnProperty(p)) {
              el[p] = props[p];
            }
          }
          if (text) {
            el.appendChild(document.createTextNode(text));
          }
          return el;
        },
        insertAfter: function (referenceNode, newNode) {
          referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        },
        post: function (path, data, callback) {
          var xhttp = new XMLHttpRequest();

          xhttp.open('POST', path, true);
          xhttp.setRequestHeader('Authorization', 'Client-ID ' + this.clientid);
          xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
              if (this.status >= 200 && this.status < 300) {
                var response = '';
                try {
                  response = JSON.parse(this.responseText);
                } catch (err) {
                  response = this.responseText;
                }
                callback.call(window, response);
              } else {
                throw new Error(this.status + " - " + this.statusText);
              }
            }
          };
          xhttp.send(data);
          xhttp = null;
        },
        createDragZone: function () {
          Array.prototype.forEach.call(this.dropzone, function (zone) {
            this.upload(zone);
          }.bind(this));
        },
        loading: function () {
          var div, table, img;

          div = this.createEls('div', {className: 'loading-modal'});
          table = this.createEls('table', {className: 'loading-table'});
          img = this.createEls('img', {className: 'loading-image', src: './css/loading-spin.svg'});

          div.appendChild(table);
          table.appendChild(img);
          document.body.appendChild(div);
        },
        matchFiles: function (file, zone) {
          if (file.type.match(/image/) && file.type !== 'image/svg+xml') {
            document.body.classList.add('loading');

            var fd = new FormData();
            fd.append('image', file);

            this.post(this.endpoint, fd, function (data) {
              document.body.classList.remove('loading');
              typeof this.callback === 'function' && this.callback.call(this, data);
            }.bind(this));
          }
        },
        upload: function (zone) {
          var events = ['dragenter', 'dragleave', 'dragover', 'drop'],
            file, target, i, len;

          zone.addEventListener('change', function (e) {
            if (e.target && e.target.nodeName === 'INPUT' && e.target.type === 'file') {
              target = e.target.files;

              for (i = 0, len = target.length; i < len; i += 1) {
                file = target[i];
                this.matchFiles(file, zone);
              }
            }
          }.bind(this), false);

          // eslint-disable-next-line
          events.map(function (event) {
            zone.addEventListener(event, function (e) {
              if (e.target && e.target.nodeName === 'INPUT' && e.target.type === 'file') {
                if (event === 'dragleave' || event === 'drop') {
                  e.target.parentNode.classList.remove('dropzone-dragging');
                } else {
                  e.target.parentNode.classList.add('dropzone-dragging');
                }
              }
            }, false);
          });
        },
        run: function () {
          var loadingModal = document.querySelector('.loading-modal');

          if (!loadingModal) {
            this.loading();
          }
          this.createDragZone();
        }
      };

      return Imgur;
    }));


    var feedback = function(res) {
      if (res.success === true) {
        var get_link = res.data.link.replace(/^http:\/\//i, 'https://');

        setState(prevState => {
          let newLocalProfile = {...prevState.localProfile};
          newLocalProfile.image = get_link;

          return {localProfile: newLocalProfile}
        });
      }
    };

    new Imgur({
      clientid: '4409588f10776f7', //You can change this ClientID
      callback: feedback
    });
  }

  removeAvatar() {
    this.setState(prevState => {
      let newLocalProfile = {...prevState.localProfile};
      newLocalProfile.image = '';

      return {localProfile: newLocalProfile}
    });
  }

  render() {
    let { id } = this.props.user.profile;
    let { name, phone, position, biography, image } = this.state.localProfile;
    let { charCount } = this.state;

    if (!id) {
      this.props.history.push('/');
    }

    return (
      <div className="ProfileEdit">
        <div className="ProfileEdit-header">
          <h3>Редактировать</h3>
            <span onClick={() => this.editUpdater()}>Done</span>
        </div>

        <div className={image ? 'ProfileEdit-avatar-container' : 'ProfileEdit-avatar-container dropzone'}>
          <img
            src={image ? `${image}` : avatarLogo}
            alt="avatarLogo"
          />

          {image ? (
              <span
                className="ProfileEdit-avatar-remove-btn"
                onClick={() => this.removeAvatar()}
              >
                  ×
              </span>
            ) : (
              <input
                type="file"
                className="input"
                accept="image/*"
              />
            )}
        </div>

        <div className="ProfileEdit-user-info">
          <div>
            <div className="ProfileEdit-user-info-label">
              Полное имя
            </div>
            <input
              onChange={event => {
                if (/[^A-zА-я|\s|-]/.test(event.target.value)) {
                  return;
                }

                this.inputChangeHandler(event, 'name')
              }}
              maxLength="30"
              placeholder="Имя Фамилия"
              type="text"
              value={name} />
          </div>
          <div>
            <div className="ProfileEdit-user-info-label">
              Номер Телефона
            </div>
            <input
              className="ProfileEdit-user-info-phone-input"
              onChange={event => {
                if (/[^0-9|+]/.test(event.target.value)) {
                  return
                }

                this.inputChangeHandler(event, 'phone');
              }}
              maxLength="13"
              placeholder="+380"
              type="tel"
              value={`+380${phone.slice(3)}`} />
          </div>
          <div>
            <div className="ProfileEdit-user-info-label">
              Должность
            </div>
            <input
              maxLength="50"
              onChange={event => this.inputChangeHandler(event, 'position')}
              type="text"
              value={position === null ? '' : position}
            />
          </div>
          <div>
            <div className="ProfileEdit-user-info-label">
              Биография
            </div>
            <div className="ProfileEdit-user-info-biography-wrapper">
              <textarea
                maxLength="1000"
                onChange={event => this.inputChangeHandler(event, 'biography')}
                value={biography === null ? '' : biography}
              />
              <span style={this.getCharCountStyle(charCount)}
              >
                {charCount}
              </span>
            </div>
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
  dispatch => ({
    onSetProfile: ( profile ) => {
      dispatch({ type: "SET_PROFILE", payload: profile })
    }
  }),
)(ProfileEdit);