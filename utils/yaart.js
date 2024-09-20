const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;
const API_URL = 'https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync';
const GET_IMG_URL = 'https://llm.api.cloud.yandex.net:443/operations/';

async function getIDart(text) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Api-Key ${YANDEX_API_KEY}`,
      'x-folder-id': YANDEX_FOLDER_ID,
    },
    body: JSON.stringify({
      modelUri: `art://${YANDEX_FOLDER_ID}/yandex-art/latest`,
      generationOptions: {
        seed: "1863",
        aspectRatio: {
          widthRatio: 1,
          heightRatio: 1
        }
      },
      messages: [
        {
          weight: 1,
          text
        }
      ]
    }),
  });

  const json = await response.json();
  if (json && json.id) return json.id
  else if (json && json.error) return Promise.reject(json.message)
  else return Promise.reject("Произошла ошибка")
}

async function getImgArt(id) {
  const response = await fetch(`${GET_IMG_URL}${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Api-Key ${YANDEX_API_KEY}`,
      'x-folder-id': YANDEX_FOLDER_ID,
    }
  });

  const data = await response.json();

  console.log(data);

  if (data && data.response) {
    var imgbase = Buffer.from(data.response.image, 'base64');
    return imgbase;
  } else {
    await new Promise(resolve => setTimeout(resolve, 10000));
    return getImgArt(id);
  }

}

module.exports = {getIDart, getImgArt}
