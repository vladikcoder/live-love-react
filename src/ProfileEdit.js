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
  }

  editUpdater(shouldRedirect) {
    // eslint-disable-next-line
    let { id } = this.state.localProfile;
    let { localProfile } = this.state;
    let { access_token } = this.props.user;

    let editFields = this.isAnyChangesMade();

    if (editFields.length) {
      let data = new FormData();

      for (let field of editFields) {
        data.append(field, localProfile[field]);
      }

      console.log('fetching...', data.get('image'));

      fetch(`http://ll.jdev.com.ua/api/users/edit/${id}`, {
        headers: {
          'Accept': 'application/json',
          // 'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${access_token}`
        },
        method: 'POST',
        body: data
      })
      .then(response => {
        if (response.ok) {
          this.setState({isEditSuccess: true});
          return response.json()
        }
      })
      .then(updatedProfile => {
        console.log('new_profile: ', updatedProfile.data);
        this.props.onSetProfile(updatedProfile.data);
        shouldRedirect &&
          this.props.history.push('/profile');
      })
      .catch(console.warn);
    } else {
      shouldRedirect &&
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
      } else {
        editableFields = editableFields.filter(item => item !== field);
      }
    }

    console.log('changes at: ', editableFields);
    return editableFields;
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

  removeAvatar() {
    this.setState(prevState => {
      let newLocalProfile = {...prevState.localProfile};
      newLocalProfile.image = '';

      return {localProfile: newLocalProfile}
    });
  }

  imageHandler(event) {
    let image = event.target.files[0];

    this.setState(prevState => {
      let newProfile = {...prevState.localProfile};
      newProfile.image = image;

      return {localProfile: newProfile}
    }, () => {
      if (image) {
        console.log('image: ', image);
        console.log('image JSON: ', JSON.stringify(image));
        this.editUpdater();
      }
    })
  }

  render() {
    let { id } = this.props.user.profile;
    let { name, phone, position, biography, image } = this.state.localProfile;
    let { charCount } = this.state;
    let baseURL = 'http://ll.jdev.com.ua/storage';

    if (!id) {
      this.props.history.push('/');
    }

    return (
      <div className="ProfileEdit">
        <div className="ProfileEdit-header">
          <h3>Редактировать</h3>
            <span
              onClick={() => this.editUpdater(['name', 'phone', 'biography', 'position', 'image'])}
            >
              Done
            </span>
        </div>

        <div className={image ? 'ProfileEdit-avatar-container' : 'ProfileEdit-avatar-container dropzone'}>

          {
            (image instanceof File) ? (
              <p>loading ...</p>
            ) : (
              <img
                src={image ? `${baseURL}/${image}` : avatarLogo}
                alt="avatarLogo"
              />
            )
          }


          {(image) ? (
              <span
                className="ProfileEdit-avatar-remove-btn"
                onClick={() => this.removeAvatar()}
              >
                  ×
              </span>
            ) : (
              <input
                onChange={event => this.imageHandler(event)}
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