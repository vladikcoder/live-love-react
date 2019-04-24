import React from "react";
import { Link } from "react-router-dom";

import "./RegConfirmation.css";
import "./checkbox.css";

import backArrow from "./img/back.png";

const Registration = () => {
  return (
    <div className="RegConfirmation">
      <div className="RegConfirmation-header">
        <Link to="/register">
          <img
            className="RegConfirmation-logo-back"
            src={backArrow}
            alt="back-btn"
          />
        </Link>
        <h3>Регистрация</h3>
      </div>
      <p className="RegConfirmation-confirm-label">Подтверждение</p>
      <p className="RegConfirmation-sms-label">
        Введите код подтверждения из СМС
      </p>

      <div className="RegConfirmation-filling-wrapper">
        <div className="RegConfirmation-code-wrapper">
          <input
            className="RegConfirmation-code-input"
            type="text"
            placeholder=" Код Подтверждения"
          />
        </div>

        <div className="RegConfirmation-status-wrapper">
          <p>
            Мы отправили код на +38063123456789. Если вы не получили код, мы
            можем <a href="#">отправить заново.</a>
          </p>
          <p>
            Ввели неправильный номер телефона? <a href="#">Изменить.</a>
          </p>
        </div>
      </div>

      <button className="RegConfirmation-cont-btn">Продолжить</button>
    </div>
  );
};

export default Registration;
