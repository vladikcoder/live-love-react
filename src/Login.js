import React, {Component} from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./Login.css";
import "./checkbox.css";
import liveLogo from "./img/live-logo.jpg";
import fetch from "cross-fetch";

class Login extends Component {
  state = {
    phone: '',
    validationInfo: '',
    logStatus: ''
  };

  componentDidMount() {
    if (this.props.user.profile.id) {
      this.props.history.push("/profile");
    }
  }

  login(phone) {
    if (phone.length !== 9) {
      this.setState({ validationInfo: 'Номер телефона должен остоять из 9 цифр' });
      return;
    } else {
      this.setState({ validationInfo: '' });
    }

    fetch('http://ll.jdev.com.ua/api/login', {
      headers: {
        'Accept': 'text/plain;charset=UTF-8',
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

      } else if (response.status === 422) {
        this.setState({
          validationInfo: '',
          logStatus: `Пользователь с номером +380${phone} ещё не зарегистрирован`
        })
      }

      return response.json();
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


};

export default connect(
  state => ({
    user: {...state.user}
  }),
  dispatch => ({
    onLogin: ( data ) => {
      dispatch({ type: "LOGIN", payload: data })
    }
  }),
)(Login);