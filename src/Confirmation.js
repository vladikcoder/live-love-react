import React, {Component} from 'react';
import {connect} from 'react-redux';
import fetch from "cross-fetch";

import {getUserProfile} from './constsService';

import './Confirmation.css';
import './checkbox.css';

import backArrow from './img/back.png';


class Confirmation extends Component {
  state = {
    isWrong: false,
    smsStatus: '',
    code: ''
  };

  componentDidMount() {
    let localToken = localStorage.getItem('access_token');

    if (this.props.user.profile.id) {
      this.props.history.push("/profile");
    }

    if (localToken) {
      getUserProfile(localToken)
      .then(data => {
        this.props.onSetToken(localToken);
        this.props.onSetProfile(data.success);
        this.props.history.push("/profile");
      })
      .catch(console.warn)
    }
  }

  smsVerify(code) {
    let {phone} = this.props.user;
    console.log('fetching: ', phone, code);
    fetch('http://ll.jdev.com.ua/api/user/smsverify', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ phone, code })
    })
    .then(response => {
      if (response.ok) {
        this.setState({ isWrong: false });
      } else if (response.status === 422) {
        this.setState({
          isWrong: true,
          smsStatus: 'Введённый код неверен или устарел'
        })
      }

      return response.json();
    })
    .then(data => {

      if (!this.state.isWrong) {
        const {access_token} = data;

        localStorage.setItem('access_token', access_token);

        this.props.onSetToken(access_token);
        getUserProfile(access_token)
          .then(data => {
            this.props.onSetProfile(data.success);
            this.props.history.push("/profile");
          })
          .catch(console.warn);
      } else {
        console.log(data);
      }
    }).catch(console.warn)
  }

  sendAgain() {
    let { phone } = this.props.user;

    fetch('http://ll.jdev.com.ua/api/login', {
      headers: {
        'Accept': 'text/plain;charset=UTF-8',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ phone })
    })
    .then(() => {
      this.setState({
        isWrong: false,
        smsStatus: 'Код отправлен повторно'
      });
    })
    .catch(console.warn)
  }

  inputHandler(event) {
    let { value } = event.target;

    this.setState({code: value});
  }


  render() {
    let { code, smsStatus } = this.state;
    let { phone } = this.props.user;

    return (
      <div className="Confirmation">
        <div className="Confirmation-header">
          <img
            alt="back-btn"
            className="Confirmation-logo-back"
            onClick={() => window.history.back()}
            src={backArrow}
          />
          <h3>Регистрация</h3>
        </div>
        <p className="Confirmation-confirm-label">Подтверждение</p>
        <p className="Confirmation-sms-label">
          Введите код подтверждения из СМС
        </p>

        { smsStatus && <p className="Confirmation-sms-status">{smsStatus}</p> }

        <div className="Confirmation-filling-wrapper">
          <div className="Confirmation-code-wrapper">
            <input
              className="Confirmation-code-input"
              type="number"
              placeholder=" Код Подтверждения"
              value={code}
              onChange={event => {
                if (event.target.value.length > 4) {
                  event.target.value = event.target.value.slice(0, 4);
                }

                this.inputHandler(event);
              }}
            />
          </div>

          <div className="Confirmation-status-wrapper">
            <p>
              Мы отправили код на +{phone}. Если вы не получили код, мы
              можем <span className="Confirmation-highlighted" onClick={() => this.sendAgain()}>отправить заново.</span>
            </p>
            <p>
              Ввели неправильный номер телефона?{' '}
              <span
                className="Confirmation-highlighted"
                onClick={() => window.history.back()}
              >
                Изменить.
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() => this.smsVerify(code)}
          className="Confirmation-cont-btn"
        >
          Продолжить
        </button>
      </div>
    );
  }

};

export default connect(
  state => ({
    user: {...state.user}
  }),
  dispatch => ({
    onSetToken: ( token ) => {
      dispatch({ type: "SET_TOKEN", payload: token })
    },

    onSetProfile: ( profile ) => {
      dispatch({ type: "SET_PROFILE", payload: profile })
    }
  }),
)(Confirmation);