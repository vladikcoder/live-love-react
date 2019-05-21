export const LOGIN = 'LOGIN';
export const SET_PROFILE = 'SET_PROFILE';
export const SET_USER = 'SET_USER';

export const onLogin = ( data ) => ({
  type: LOGIN,
  payload: data
});

export const onSetProfile = ( profile ) => ({
  type: SET_PROFILE,
  payload: profile
});

export const onRegister = ( user ) => ({
  type: SET_USER,
  payload: {...user, profile: {}}
});

