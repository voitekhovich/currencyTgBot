const RANDOME_IMG_URL = 'https://api.nekosapi.com/v4/images/random';

exports.request = () => {
  return fetch(RANDOME_IMG_URL, {
    method: 'GET',
  })
    .then((res) => {
      if (!res.ok) { 
        throw new Error(`Primary URL failed with status: ${res.status}`);
      }
      return res.json();
    })
    .then((json) => {
      if (json.items && json.items.length > 0) {
      return json.items[0].image_url;
      } else {
        throw new Error("No items found in the primary response.");
      }
    })
    .catch(err => {
      console.log('nekosapi ERROR:' + err);
      throw err;
    });
};
