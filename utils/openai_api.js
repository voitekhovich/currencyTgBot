const OpenAI = require("openai");
const constants = require("./constants.js");

const openai = new OpenAI({
   apiKey: '',
   baseURL: "http://127.0.0.1:1337/v1"
});

async function openaiAPI(message) {

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    //model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: message }],
    //stream: true,
  });

   return completion.choices[0]?.message?.content;
  //for await (const chunk of stream) {
  //  process.stdout.write(chunk.choices[0]?.delta?.content || '');
  //}

}

module.exports = openaiAPI;
