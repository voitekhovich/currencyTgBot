const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");

const constants = require("../utils/constants.js");
const files = require("../utils/files.js");

const API_KEY_BOT = process.env.API_KEY_BOT;
const YA_300_TOKEN = process.env.YA_300_TOKEN;

let lastDate = "";
const messagesID = files.readMapFromFile();

exports.tgBot = (text) => {
  lastDate = text;
  messageUpdate();
};

console.log("Start bot...");

const bot = new TelegramBot(API_KEY_BOT, {
  polling: {
    interval: 750,
    autoStart: true,
  },
});

bot.setMyCommands(constants.commands);

bot.on("polling_error", (error) => {
  console.log(error.code);
});

bot.onText(/^\/add$/, async (msg) => {
  const res = await bot.sendMessage(msg.chat.id, lastDate, {
    // parse_mode: "HTML",
    disable_notification: true,
  });

  bot.pinChatMessage(res.chat.id, res.message_id);

  if (
    messagesID.get(res.chat.id) &&
    messagesID.get(res.chat.id) !== res.message_id
  ) {
    console.log("unpin");
    bot.deleteMessage(res.chat.id, messagesID.get(res.chat.id));
  }

  messagesID.set(res.chat.id, res.message_id);
  console.log(messagesID);
  files.saveMapToFile(messagesID);
});

bot.onText(/^\/now$/, async (msg) => {
  const res = await bot.sendMessage(msg.chat.id, lastDate, {
    // parse_mode: "HTML",
    disable_notification: true,
  });
});

// ПИШЕМ ТЕСТОВОГО БОТА ДЛЯ СУММАРИЗАЦИИ
// =====================================

bot.onText(/^\/test$/, async (msg) => {
  const article_url = 'https://habr.com/ru/news/729422/';
  const endpoint = 'https://300.ya.ru/api/sharing-url';
  const token = YA_300_TOKEN;

  fetch(endpoint, article_url)
    .then(function (response) {
      response.text().then(function (text) {
        poemDisplay.textContent = text;
      });
    });

  fetch(endpoint, {
      method: 'POST',
      headers: {'Authorization': `OAuth ${token}`},
      // json: {
      //   'article_url': article_url
      // },
      body: JSON.stringify({
        'article_url': article_url
        // name: userData.name,
        // about: userData.about
      })
    })
    .then(res => {
      res.ok? res.json() : Promise.reject(res.status)
    })
    .then(json => {
      bot.sendMessage(msg.chat.id, json.sharing_url, {
        disable_notification: true,
      });
    })
    .catch(res_status => {
      bot.sendMessage(msg.chat.id, res_status, {
        disable_notification: true,
      });
    })

});

// =====================================

bot.on('text', async (msg) => {
  
  // var pattern = /^\s*нет[ьъ]?\s*[!:=()Dd]*\s*$/i;
  var pattern = /^\s*[hnн]\s?[eе]\s?[tт][ьъ]?\s*[.,!:=()Dd]*\s*$/i;
  var pattern2 = /^\s*[д]\s?[аa]\s*[.,!:=()Dd]*\s*$/i;
  var pattern3 = /семь[я|ёй|е]|семейный/i;
  var pattern4 = /рофлю/i;
  
  var timer = 1000;

  if (pattern.test(msg.text)) {
    try {

      await setTimeout(() => {
        const imageBuffer = fs.readFileSync("./images/goose-pdr.png");
        // bot.sendPhoto(msg.chat.id, imageBuffer);
        bot.sendSticker(msg.chat.id, imageBuffer);
      }, timer);

    } catch(e) {
      console.log('err load image: ' + e);
    }
  } else if (pattern2.test(msg.text)) {
    try {

      await setTimeout(() => {
        const imageBuffer = fs.readFileSync("./images/pizda.png");
        // bot.sendPhoto(msg.chat.id, imageBuffer);
        bot.sendSticker(msg.chat.id, imageBuffer);
      }, timer);

    } catch(e) {
      console.log('err load image: ' + e);
    }
  } else if (pattern3.test(msg.text)) {
    try {

      await setTimeout(() => {
        const imageBuffer = fs.readFileSync("./images/family.png");
        // bot.sendPhoto(msg.chat.id, imageBuffer);
        bot.sendSticker(msg.chat.id, imageBuffer);
      }, timer);

    } catch(e) {
      console.log('err load image: ' + e);
    }
  } 
  else if (pattern4.test(msg.text)) {
    try {

      await setTimeout(() => {
        const imageBuffer = fs.readFileSync("./images/rofl.png");
        // bot.sendPhoto(msg.chat.id, imageBuffer);
        bot.sendSticker(msg.chat.id, imageBuffer);
      }, timer);

    } catch(e) {
      console.log('err load image: ' + e);
    }
  } 
});

// bot.onText(/^\/info$/, async (msg) => {
//   text = constants.infoBotText;
//   bot.sendMessage(msg.chat.id, text, {
//     // parse_mode: "HTML",
//   });
// });

const messageUpdate = () => {
  console.log("Update messages...");
  // console.log(messagesID);
  for (let item of messagesID) {
    // console.log(item);
    const [chat_id, message_id] = item;

    try {
      bot.editMessageText(lastDate, {
        chat_id,
        message_id,
        // parse_mode: "HTML",
      });
    } catch (err) {
      console.log("Не обновилось");
    }
  }
};
