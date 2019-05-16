import fetch from "cross-fetch";

export const AVATAR_BASE_URL = 'http://ll.jdev.com.ua/storage';

export const getUserProfile = (phone, access_token) => {
  return fetch(`http://ll.jdev.com.ua/api/users/${phone}`, {
    headers: {
      'Accept': 'text/html; charset=UTF-8',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    },
    method: 'GET'
  })
  .then(response => {
    if (response.status === 422 || response.status === 500) {
      localStorage.removeItem('phone');
      localStorage.removeItem('access_token');
    } else if (response.ok) {
      return response.json()
    }
  })
};