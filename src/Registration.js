import React, {Component} from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./Registration.css";
import "./checkbox.css";
import backArrow from "./img/back.png";
import fetch from "cross-fetch";

class Registration extends Component {
  state = {
    name: '',
    phone: '',
    regStatus: '',
    isRegSuccess: false,
    isAgree: false,
    agreeStyle: {
      'background' : 'none'
    },
    validationPhoneInfo: '',
    validationNameInfo: ''
  };

  componentDidMount() {
    if (this.props.user.profile.id) {
      this.props.history.push("/profile");
    }

    this.agreeHandler = this.agreeHandler.bind(this);
  }

  register(name, phone, isAgree) {
    if (!isAgree) {
      this.setState({
        agreeStyle: {
          'background': 'rgba(211, 49, 60, 0.15)'
        }
      });
      return;
    }

    if (phone.length !== 9) {
      this.setState({ validationPhoneInfo: 'Номер телефона должен остоять из 9 цифр' });
    } else {
      this.setState({ validationPhoneInfo: '' });
    }

    if (name.length < 5) {
      this.setState({ validationNameInfo: 'Имя и Фамилия должны содержать не менее 2-х букв' });
      return;
    } else if (name.length > 4 && !/\s/.test(name)) {
      this.setState({ validationNameInfo: 'Имя и Фамилия должны быть разделены пробелом' });
      return;
    } else {
      this.setState({ validationNameInfo: '' });
    }

    if (this.state.validationPhoneInfo) {
      return;
    }

    fetch('http://ll.jdev.com.ua/api/register', {
      headers: {
        'Accept': 'text/plain;charset=UTF-8',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ name: name.trim(), phone: `380${phone}` })
    })
    .then(response => {
      if (response.ok) {
        this.setState({ isRegSuccess: true, regStatus: '' });
      } else if (response.status === 422) {
        this.setState({
          validationPhoneInfo: '',
          regStatus: `Пользователь с номером +380${phone} уже зарегистрирован`
        })
      }

      return response.json();
    })
    .then(() => {
      this.props.onRegister({
        phone: `380${phone}`
      });

      this.props.history.push("/confirm");
    }).catch(console.warn)
  }

  inputHandler(event, field) {
    let { value } = event.target;

    if (field === 'name') {
      this.setState({ name: value })
    } else if (field === 'phone') {
      this.setState({ phone: value })
    }
  }

  agreeHandler() {
    this.setState(prevState => ({
      isAgree: !prevState.isAgree,
      agreeStyle: {
        'background' : 'none'
      }}))
  }

  render() {
    let { regStatus, name, phone, isAgree, agreeStyle, validationNameInfo, validationPhoneInfo } = this.state;

    return (
      <div className="Registration">
        <div className="Registration-header">
          <Link to="/">
            <img
              className="Registration-logo-back"
              src={backArrow}
              alt="back-btn"
            />
          </Link>

          <h3>Регистрация</h3>
        </div>

        { !isAgree &&
        <p className="Registration-offer-label">
          Пожалуйста, согласитесь с условиями оферты
        </p>}

        <p className="Registration-personal-label">Личные данные</p>

        <p className="Registration-please-label">
          Пожалуйста, введите своё имя и номер телефона
        </p>

        {regStatus && <p className="Registration-status-label">
          {regStatus}
        </p>}

        {validationNameInfo && <p className="Registration-status-label">
          {validationNameInfo}
        </p>}

        {validationPhoneInfo && <p className="Registration-status-label">
          {validationPhoneInfo}
        </p>}

        <div className="Registration-filling-wrapper">
          <div className="Registration-name-wrapper">
            <input
              className="Registration-name-input"
              maxLength="30"
              onChange={event => {
                if (/[^A-zА-я|\s|-]/.test(event.target.value)) {
                  return;
                }

                this.inputHandler(event, 'name')
              }}
              placeholder=" Полное Имя"
              type="text"
              value={this.state.name}
            />
          </div>
          <div className="Registration-phone-wrapper">
            <span className="Registration-country-code">+380</span>
            <input
              className="Registration-phone-input"
              type="number"
              placeholder=" Номер Телефона"
              onChange={event => {
                if (event.target.value.length > 9) {
                  event.target.value = event.target.value.slice(0, 9);
                }

                this.inputHandler(event, 'phone')
              }}
              value={this.state.phone}
            />
          </div>

          <div style={agreeStyle} className="Registration-agree-wrapper">
            <input
              onChange={() => this.agreeHandler()}
              id="agree"
              checked={isAgree}
              type="checkbox"
            />
            <label htmlFor="agree">
              {" "}
              Соглашаюсь с <Link to="/offer">Условиями оферты</Link>
            </label>
          </div>
          <button
            onClick={() => this.register(name, phone, isAgree)}
            className="Registration-cont-btn"
          >
            Продолжить
          </button>
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
    onRegister: (user) => {
      dispatch({ type: "SET_USER", payload: {...user, profile: {}} })
    }
  }),
)(Registration);