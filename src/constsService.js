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

export const getCorrectForm = (wordCount, firstForm, secondForm, thirdForm) => {
    switch (wordCount.toString().slice(-1)) {
        case '1':
          switch (wordCount.toString().slice(-2)) {
            case '11':
              return `${wordCount} ${thirdForm}`;
            default:
              return `${wordCount} ${firstForm}`;
          }

        case '2':
        case '3':
        case '4':
          switch (wordCount.toString().slice(-2)) {
            case '12':
            case '13':
            case '14':
              return `${wordCount} ${thirdForm}`;
            default:
              return `${wordCount} ${secondForm}`;
          }

        default:
            return `${wordCount} ${thirdForm}`;
    }
};