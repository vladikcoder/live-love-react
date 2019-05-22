import React, {Component} from 'react';
import {connect} from 'react-redux';
import fetch from 'cross-fetch';

import {onSetProfile} from '../store/actions';
import {AVATAR_BASE_URL} from '../constsService';

import './styles/ProfileEdit.css';

import avatarLogo from './img/avatar.png';
import emptyLogo from './img/empty.png';
import facebookLogo from './img/fb.png';
import instagramLogo from './img/inst.png';
import stravaLogo from './img/strava.png';

class ProfileEdit extends Component {
  state = {
    localProfile: {
      'id': '',
      'name': '',
      'phone': '',
      'created_at': '',
      'updated_at': '',
      'position': '',
      'biography': '',
      'programs': [],
      'image': null,
      'facebook': null,
      'instagram': null,
      'strava': null
    },
    charCount: '',
    pendingSocial: '',
    pendingSocialQuery: '',
    showModal: false
  };

  componentDidMount() {
    let {profile} = this.props.user;

    this.setState({
      localProfile: {...profile},
      charCount: (profile.biography) ? 1000 - profile.biography.length : 1000
    });
  }

  editUpdater(shouldRedirect) {
    // eslint-disable-next-line
    let {localProfile} = this.state;
    let access_token = localStorage.getItem('access_token');
    let editFields = this.getChangedFields();

    if (editFields.length) {
      let data = new FormData();

      for (let field of editFields) {
        data.append(field, localProfile[field]);
      }

      data.append('_method', 'PUT');

      fetch(`http://ll.jdev.com.ua/api/users`, {
        headers: {
          'Accept': 'application/json;v=1.0',
          'Authorization': `Bearer ${access_token}`,
          // 'Content-Type': 'application/x-www-form-urlencoded',
          // 'Content-Type': 'multipart/form-data',
        },
        method: 'POST',
        body: data
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
      }).then(updatedProfile => {

        console.log('new_profile: ', updatedProfile);
        this.props.onSetProfile(updatedProfile);
        this.setState({localProfile: updatedProfile});

        shouldRedirect &&
        this.props.history.push('/profile');
      }).catch(console.warn);
    } else {
      shouldRedirect &&
      this.props.history.push('/profile');
    }
  }

  getChangedFields() {
    let editableFields = ['name', 'phone', 'biography', 'position', 'image', 'facebook', 'instagram', 'strava'];
    let {localProfile} = this.state;
    let {profile} = this.props.user;

    for (let field of editableFields) {
      if (localProfile[field] === profile[field]) {
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
        };
      }

      return {
        localProfile: newProfile
      };
    });
  }

  getCharCountStyle(charCount) {
    return {
      color: (charCount > 0) ? (
        'rgb(199, 199, 204)'
      ) : (
        'rgb(211, 49, 60)'
      )
    };
  }

  removeAvatar() {
    this.setState(prevState => {
      let newLocalProfile = {...prevState.localProfile};
      newLocalProfile.image = null;

      return {localProfile: newLocalProfile};
    });
  }

  imageHandler(event) {
    let image = event.target.files[0];

    this.setState(prevState => {
      let newProfile = {...prevState.localProfile};
      newProfile.image = image;

      return {localProfile: newProfile};
    }, () => {
      if (image) {
        console.log('image: ', image);
        console.log('image JSON: ', JSON.stringify(image));
        this.editUpdater();
      }
    });
  }

  inputSocialHandler(event) {
    let {value} = event.target;

    this.setState({pendingSocialQuery: value});
  }

  addSocial(networkName, socialId) {
    let socialProfileLink = '';
    // eslint-disable-next-line
    switch (networkName) {
      case 'facebook':
        if (/\D/.test(socialId)) {
          socialProfileLink = `https://www.facebook.com/${socialId}`
        } else {
          socialProfileLink = `https://www.facebook.com/profile.php?id=${socialId}`
        }
        break;

      case 'instagram':
        socialProfileLink = `https://www.instagram.com/${socialId}`;
        break;

      case 'strava':
        socialProfileLink = `https://www.strava.com/athletes/${socialId}`;
        break;
    }

    this.setState(prevState => {
      let newProfile = {...prevState.localProfile};
      newProfile[networkName] = socialProfileLink;

      return {
        localProfile: newProfile,
        pendingSocialQuery: '',
        pendingSocial: '',
        showModal: false
      }
    })
  }

  removeSocial(networkName) {
    this.setState(prevState => {
      let newProfile = {...prevState.localProfile};
      newProfile[networkName] = '';

      return {localProfile: newProfile}
    })
  }

  render() {
    let {id} = this.props.user.profile;
    let {name, phone, position, biography, image, facebook, instagram, strava} = this.state.localProfile;
    let {charCount, pendingSocial, pendingSocialQuery, showModal} = this.state;

    if (!id) {
      this.props.history.push('/');
    }

    return (
      <div className="ProfileEdit">
        {showModal &&
          <div className="ProfileEdit-add-social-modal-background">
            <div className="ProfileEdit-add-social-modal-window">
              <p className="add-social-modal-window-header">Введите Id или Nickname вашего <span>{pendingSocial}</span> профиля</p>
              <div>
                <input
                  maxLength="30"
                  onChange={(event) => this.inputSocialHandler(event)}
                  type="text"
                  value={pendingSocialQuery}
                />
              </div>
              <div className="add-social-modal-buttons-wrapper">
                <button
                  onClick={() =>
                    this.setState({
                      pendingSocial: '',
                      pendingSocialQuery: '',
                      showModal: false
                    })}
                >
                  Отмена
                </button>
                <button
                  onClick={() => this.addSocial(pendingSocial, pendingSocialQuery)}
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        }

        <div className="ProfileEdit-header">
          <h3>Редактировать</h3>
          <span
            onClick={() => this.editUpdater(true)}
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
                alt="avatarLogo"
                onError={event =>{
                  event.target.src = avatarLogo
                }}
                src={image ? `${AVATAR_BASE_URL}/${image}` : avatarLogo}
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

                this.inputChangeHandler(event, 'name');
              }}
              maxLength="30"
              placeholder="Имя Фамилия"
              type="text"
              value={name}/>
          </div>
          <div>
            <div className="ProfileEdit-user-info-label">
              Номер Телефона
            </div>
            <input
              className="ProfileEdit-user-info-phone-input"
              onChange={event => {
                if (/[^0-9|+]/.test(event.target.value)) {
                  return;
                }

                this.inputChangeHandler(event, 'phone');
              }}
              maxLength="13"
              placeholder="+380"
              type="tel"
              value={`+380${phone.slice(3)}`}/>
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
              <img src={facebook ? facebookLogo : emptyLogo} alt="emptyLogo"/>
              <span className="User-info-social-label">
                {facebook ? <a href={facebook}>Facebook</a> : "Добавить Facebook"}
              </span>
              <span
                className={facebook ? "User-info-social-connect delete" : "User-info-social-connect"}
                onClick={() => facebook ? (
                  this.removeSocial('facebook')
                ) : (
                  this.setState({showModal: true, pendingSocial: 'facebook'})
                )}
              >
                {facebook ? "УДАЛИТЬ" : "ДОБАВИТЬ"}
              </span>
            </div>

            <div className="User-info-social Instagram">
              <img src={instagram ? instagramLogo : emptyLogo} alt="emptyLogo"/>
              <span className="User-info-social-label">
                {instagram ? <a href={instagram}>Instagram</a> : "Добавить Instagram"}
              </span>
              <span
                className={instagram ? "User-info-social-connect delete" : "User-info-social-connect"}
                onClick={() => instagram ? (
                  this.removeSocial('instagram')
                ) : (
                  this.setState({showModal: true, pendingSocial: 'instagram'})
                )}
              >
                {instagram ? "УДАЛИТЬ" : "ДОБАВИТЬ"}
              </span>
            </div>

            <div className="User-info-social Strava">
              <img src={strava ? stravaLogo : emptyLogo} alt="emptyLogo"/>
              <span className="User-info-social-label">
                {strava ? <a href={strava}>Strava</a> : "Добавить Strava"}
              </span>
              <span
                className={strava ? "User-info-social-connect delete" : "User-info-social-connect"}
                onClick={() => strava ? (
                  this.removeSocial('strava')
                ) : (
                  this.setState({showModal: true, pendingSocial: 'strava'})
                )}
              >
                {strava ? "УДАЛИТЬ" : "ДОБАВИТЬ"}
              </span>
            </div>

          </div>
        </div>

      </div>
    );
  }

}

const mapStateToProps = state => {
  return {
    user: {...state.user}
  }
};

const mapDispatchToProps = {
  onSetProfile
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit);