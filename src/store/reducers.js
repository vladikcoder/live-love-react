import {LOGIN, SET_PROFILE, SET_TOKEN, SET_USER} from './actions';

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

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: {...state.user, ...action.payload}
      };

    case SET_PROFILE:
      return {
        ...state,
        user: {...state.user, profile: { ...state.user.profile, ...action.payload} }
      };

    case SET_TOKEN:
      return {
        ...state,
        user: {...state.user, access_token: action.payload}
      };

    case SET_USER:
      return {
        ...state,
        user: {...action.payload}
      };

    default:
      return state
  }
};

export default reducer;