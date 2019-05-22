import React, {Component} from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import fetch from "cross-fetch";

import {onLogin, onSetProfile} from '../store/actions';
import {getUserProfile} from '../constsService';

import liveLogo from "./img/live-logo.jpg";
import "./styles/Login.css";
import "./styles/checkbox.css";

class Login extends Component {
  state = {
    phone: '',
    validationPhoneInfo: '',
    logStatus: ''
  };

  componentDidMount() {
    let localToken = localStorage.getItem('access_token');

    if (this.props.user.profile.id) {
      this.props.history.push("/profile");
    }

    if (localToken) {
      getUserProfile(localToken)
        .then(data => {
          if (data.success) {
            this.props.onSetProfile(data.success[0]);
            this.props.history.push("/profile");
          }
        })
        .catch(console.warn)
    }
  }

  login(phone) {
    if (phone.length !== 9) {
      this.setState({ validationPhoneInfo: 'Номер телефона должен остоять из 9 цифр' });
      return;
    } else {
      this.setState({ validationPhoneInfo: '' });
    }

    fetch('http://ll.jdev.com.ua/api/login', {
      headers: {
        'Accept': 'application/json;v=1.0',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      // body: JSON.stringify({name: 'sergey',phone: '380672623783'})
      body: JSON.stringify({ phone: `380${phone}` })
    })
    .then(response => {
      if (response.ok) {
        this.setState({ logStatus: '' });
        this.props.onLogin({ phone: `380${phone}` });
        this.props.history.push("/confirm");
      } else if (response.status === 401) {
        this.setState({
          validationPhoneInfo: '',
          logStatus: `Пользователь с номером +380${phone} ещё не зарегистрирован`
        })
      }
    })
    .catch(console.warn)
  }

  inputHandler(event) {
    let { value } = event.target;

    this.setState({ phone: value })
  }


  render() {
    let { phone, validationInfo, logStatus } = this.state;

    return (
      <div className="Login">
        <img className="Login-live-logo" src={liveLogo} alt="app-logo" />

        <p className="Login-please-label">
          Введите свой номер телефона для входа
        </p>

        {logStatus && <p className="Login-status">{logStatus}</p>}

        {validationInfo && <p className="Login-status">{validationInfo}</p>}

        <div className="Login-filling-wrapper">
          <div className="Login-phone-wrapper">
            <span className="Login-country-code">+380</span>
            <input
              className="Login-phone-input"
              type="number"
              placeholder=" Номер Телефона"
              onChange={event => {
                if (event.target.value.length > 9) {
                  event.target.value = event.target.value.slice(0, 9);
                }

                this.inputHandler(event);
              }}
            />
          </div>

          <div className="Login-register-wrapper">
            <p>
              Ещё не с нами? <Link to="/register">Региструйтесь</Link>
            </p>
          </div>
          <button onClick={() => this.login(phone)} className="Login-cont-btn">Продолжить</button>
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
  onLogin,
  onSetProfile
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);