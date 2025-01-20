const RANDOME_IMG_URL = 'https://api.nekosapi.com/v4/images/random';

exports.request = () => {
  return fetch(RANDOME_IMG_URL, {
    method: 'GET',
  })
    .then((res) => {
      if (res.ok) return res.json();
      return Promise.reject(res.status);
    })
    .then(data => data.items[0].image_url)
    .catch(err => {
      throw err;
    });
};
