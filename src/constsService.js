import fetch from "cross-fetch";

export const AVATAR_BASE_URL = 'http://ll.jdev.com.ua/storage';

export const getUserProfile = (access_token) => {
  return fetch(`http://ll.jdev.com.ua/api/users`, {
    headers: {
      'Accept': 'application/json;v=1.0',
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })
  .then(response => {
    if (response.ok) {
      return response.json()
    } else {
      localStorage.removeItem('access_token');
    }
  })
};