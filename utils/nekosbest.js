const RANDOME_IMG_URL = 'https://nekos.best/api/v2/neko';

exports.request = () => {
  return fetch(RANDOME_IMG_URL, {
    method: 'GET',
  })
    .then((res) => {
      if (res.ok) return res.json();
      return Promise.reject(res.status);
    })
    .then(data => data.results.url)
    .catch(err => {
      throw err;
    });
};
