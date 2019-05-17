import fetch from "cross-fetch";

export const AVATAR_BASE_URL = 'http://ll.jdev.com.ua/storage';

export const getUserProfile = (access_token) => {
  return fetch(`http://ll.jdev.com.ua/api/users`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    },
    method: 'GET'
  })
  .then(response => {
    if (response.status === 401) {
      localStorage.removeItem('access_token');
    } else if (response.ok) {
      return response.json()
    }
  })
};