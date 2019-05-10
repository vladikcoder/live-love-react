import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from "./App";
import "./styles.css";

const initialState = {
  user: {
    name: '',
    phone: '',
    access_token: '',
    profile: {
      "id":"",
      "name":"",
      "phone":"",
      "created_at":"",
      "updated_at":"",
      "position":null,
      "biography":null,
      "programs":[],
      "image": null,
      "facebook" : null,
      "instagram" : null,
      "strava" : null

      // "id":32,
      // "name":"Vlad Polyakov",
      // "phone":"380634530267",
      // "created_at":"2019-04-28 11:29:00",
      // "updated_at":"2019-04-28 11:29:00",
      // "position":null,
      // "biography":null,
      // "programs":[{
      //   done: true,
      //   duration: "12 недель",
      //   comments: "12 Комментариев",
      //   location: "Бассейн КПИ",
      //   next_date: "2019-05-11 14:30",
      //   participants: "16 участников",
      //   photo: "https://cdn.lifehacker.ru/wp-content/uploads/2017/06/swim_1496916175-1140x570.jpg",
      //   title: "Проплыви свой первый километр",
      // },],
      // "image": null,
      // "facebook" : null,
      // "instagram" : "https://www.instagram.com/anastasia_oconnell/",
      // "strava" : null
    }
  }
};

function reducer(state = initialState, action) {
  if (action.type === 'SET_USER') {
    return {
      ...state,
      user: {...action.payload}
    };
  }

  if (action.type === 'SET_TOKEN') {
    return {
      ...state,
      user: {...state.user, access_token: action.payload}
    };
  }

  if (action.type === 'SET_PROFILE') {
    return {
      ...state,
      user: {...state.user, profile: { ...state.user.profile, ...action.payload} }
    };
  }

  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: {...state.user, ...action.payload}
    };
  }

  return state;
}

const store = createStore(reducer);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>
  </Provider>,
  rootElement
);
