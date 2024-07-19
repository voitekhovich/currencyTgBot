const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;
const API_URL = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion';

async function askAi(text, role='Ты умный ассистент') {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Api-Key ${YANDEX_API_KEY}`,
      'x-folder-id': YANDEX_FOLDER_ID,
    },
    body: JSON.stringify({
      modelUri: `gpt://${YANDEX_FOLDER_ID}/yandexgpt-lite`,
      completionOptions: {
        stream: false,
        temperature: 0.3,
        maxTokens: '1000',
      },
      messages: [
        {
          role: 'system',
          text: role,
        },
        {
          role: 'user',
          text,
        },
      ],
    }),
  });

  const json = await response.json();
  console.log(json);
  return json.result.alternatives[0].message.text;
}

exports.askAi = askAi;