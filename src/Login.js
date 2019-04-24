import React from "react";
import { Link } from "react-router-dom";

import "./Login.css";
import "./checkbox.css";
import liveLogo from "./img/live-logo.jpg";

const Login = () => {
  return (
    <div className="Login">
      <img className="Login-live-logo" src={liveLogo} />

      <p className="Login-please-label">
        Введите свой номер телефона для входа
      </p>

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
            }}
          />
        </div>

        <div className="Login-register-wrapper">
          <p>
            Ещё не с нами? <Link to="/register">Региструйтесь</Link>
          </p>
        </div>
        <button className="Login-cont-btn">Продолжить</button>
      </div>
    </div>
  );
};

export default Login;
