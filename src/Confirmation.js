import React, {Component} from 'react';
import {connect} from 'react-redux';
import fetch from "cross-fetch";

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

    if (this.props.user.profile.id) {
      this.props.history.push("/profile");
    }
  }

  smsVerify(code) {
    console.log(`Auth: 'Bearer ${this.props.user.data.token}'`)

    fetch('http://ll.jdev.com.ua/api/user/smsverify', {
      headers: {
        'Accept': 'text/html; charset=UTF-8',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.user.data.token}`
      },
      method: 'POST',
      // body: JSON.stringify({name: 'sergey',phone: '380672623783'})
      body: JSON.stringify({ code })
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

      return response.text();
    })
    .then(data => {
      if (!this.state.isWrong) {
        this.props.onSetProfile(JSON.parse(data));
        this.props.history.push("/profile");
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
    .then(response => {
      this.setState({
        isWrong: false,
        smsStatus: 'Код отправлен повторно'
      });

      return response.json();
    })
    .then(this.props.onSetToken)
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
              type="text"
              placeholder=" Код Подтверждения"
              value={code}
              onChange={(event) => this.inputHandler(event)}
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