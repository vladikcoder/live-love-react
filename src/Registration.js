import React from "react";
import { Link } from "react-router-dom";

import "./Registration.css";
import "./checkbox.css";
import backArrow from "./img/back.png";

const Registration = () => {
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

      <p className="Registration-offer-label">
        Пожалуйста, согласитесь с условиями оферты
      </p>
      <p className="Registration-personal-label">Личные данные</p>
      <p className="Registration-please-label">
        Пожалуйста, введите своё имя и номер телефона
      </p>

      <div className="Registration-filling-wrapper">
        <div className="Registration-name-wrapper">
          <input
            className="Registration-name-input"
            type="text"
            placeholder=" Полное Имя"
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
            }}
          />
        </div>

        <div className="Registration-agree-wrapper">
          <input id="agree" type="checkbox" />
          <label htmlFor="agree">
            {" "}
            Соглашаюсь с <a href="#">Условиями оферты</a>
          </label>
        </div>
        <button className="Registration-cont-btn">Продолжить</button>
      </div>
    </div>
  );
};

export default Registration;
