const RANDOME_IMG_URL = 'https://api.nekosapi.com/v3/images/random';
//const CATGIRL = 'https://api.nekosapi.com/v3/images/tags'

exports.request = () => {
  return fetch(RANDOME_IMG_URL, {
    method: 'GET',
    tag: 8,
  })
    .then((res) => {
      if (res.ok) return res.json();
      return Promise.reject(res.status);
    });
};
