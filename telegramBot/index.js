const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");

const func = require("./functions");
const yapi = require("../utils/yapi");
const { askAi } = require("../utils/yagpt");
const { getIDart, getImgArt } = require("../utils/yaart");

const openaiAPI = require("../utils/openai_api");

const constants = require("../utils/constants.js");
const files = require("../utils/files.js");

const API_KEY_BOT = process.env.API_KEY_BOT;
const YA_300_TOKEN = process.env.YA_300_TOKEN;

let lastDate = "";
const lastMsg = {
  url: '',
  mesgId: ''
};
// const messagesID = files.readMapFromFile();

exports.tgBot = (text) => {
  lastDate = text;
  // messageUpdate();
};

console.log("Start tgBot...");

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

const sendMsg = async (text, msg, format, msgId) => {
  return await bot.sendMessage(msg.chat.id, text, {
    disable_notification: true,
    ...(!!format && { parse_mode: "HTML" }),
    ...(!!msgId && { reply_to_message_id: msgId })
  });
}

const editMsg = async (text, msgWait, format, msgId) => {
  await bot.editMessageText(text, {
    chat_id: msgWait.chat.id,
    message_id: msgWait.message_id,
    ...(!!format && { parse_mode: "HTML" }),
    ...(!!msgId && { reply_to_message_id: msgId })
  });
}


// bot.onText(/^\/add(@aloy_vbot)?$/, async (msg) => {
//   const res = await bot.sendMessage(msg.chat.id, lastDate, {
//     // parse_mode: "HTML",
//     disable_notification: true,
//   });

//   bot.pinChatMessage(res.chat.id, res.message_id);

//   if (
//     messagesID.get(res.chat.id) &&
//     messagesID.get(res.chat.id) !== res.message_id
//   ) {
//     console.log("unpin");
//     bot.deleteMessage(res.chat.id, messagesID.get(res.chat.id));
//   }

//   messagesID.set(res.chat.id, res.message_id);
//   console.log(messagesID);
//   files.saveMapToFile(messagesID);
// });

bot.onText(/^\/now(@aloy_vbot)?$/, async (msg) => {
  if (lastDate === '') return console.log('курсы ещё не получены');
  const res = await bot.sendMessage(msg.chat.id, lastDate, {
    // parse_mode: "HTML",
    disable_notification: true,
  });
});

// YAGPT API
// bot.on('text', async msg => {
//   try {
//     if (msg.text.startsWith('gpt')) {
//       const result = await askAi(msg.text.slice(4));
//       await bot.sendMessage(msg.chat.id, result, {
//         disable_notification: true,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// YAGPT ART
// bot.on('text', async msg => {
//   try {
//     if (msg.text.toLowerCase().startsWith('нарисуй')) {

//       getIDart(msg.text.slice(4))
//         .then(id => id)
//         .then(async id => {
//           const text = 'Рисую...';
//           const msgWait = await bot.sendMessage(msg.chat.id, text, {
//             disable_notification: true,
//           });
//           getImgArt(id)
//             .then(async image => {
//               await bot.deleteMessage(msgWait.chat.id, msgWait.message_id);
//               await bot.sendPhoto(msg.chat.id, image, {
//                 disable_notification: true,
//               });
//             })
//         })
//         .catch(async err => {
//           await bot.sendMessage(msg.chat.id, err, {
//             disable_notification: true,
//           })
//         })
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// Слушаем каждое сообщение и запоминаем из него ссылку
bot.on('text', async msg => {
  const url = await func.getUrlFromMessage(msg.text);
  if (url != null) {
    lastMsg.mesgId = msg.message_id;
    lastMsg.url = url;
  }
})

bot.onText(/^\/summary(@aloy_vbot)?$/, async (msg) => {

  // if (last_url === '') return sendMsg('Отправьте ссылку в чат', msg);
  if (lastMsg.url === '') return sendMsg('Отправьте ссылку на статью в чат и повторите запрос', msg);

  // const last_url = 'https://habr.com/ru/articles/822121';

  const msgWait = await sendMsg('Отправляю ссылку ФСБ-шникам...', msg, true, lastMsg.mesgId)
  // console.log(msgWait);

  yapi.request(YA_300_TOKEN, lastMsg.url)
    .then(json => {
      editMsg('Ответ получен, осталось обработать...', msgWait)
      return json
    })
    .then(json => func.getDataFromDOM(json.sharing_url))
    .then(data => editMsg(data, msgWait, true))
    .then(() => {
      lastMsg.mesgId = '';
      lastMsg.url = ''
    })
    .catch(err => {
      console.log(err)
      // sendMsg(`Извините, но что-то пошло не так...`, msg);
      editMsg('ФСБ-шники не ответили :(', msgWait)
    })
  // .finnaly(() => {
  //   ????????
  // })

});

bot.onText(/^\/random(@aloy_vbot)?$/, async (msg) => {
  func.getRandomImage()
    .then(imgUrl => {
      console.log(imgUrl);
      bot.sendPhoto(msg.chat.id, imgUrl, {
        has_spoiler: true,
        disable_notification: true, 
      });
    })
    .catch(err => {
      console.log(imgUrl);
      bot.sendMsg('random error:' + err.split('\n')[0], msg, true);
    })
});

bot.onText(/^\/random(@aloy_vbot)?$/, async (msg) => {
  func.getRandomImage()
    .then(imgUrl => {
      console.log(imgUrl);
      bot.sendPhoto(msg.chat.id, imgUrl, {
        has_spoiler: false,
        disable_notification: true, 
      });
    })
    .catch(err => {
      console.log(imgUrl);
      bot.sendMsg(err, msg, true);
    })
});

bot.on('text', async (msg) => {

  // var pattern = /^\s*нет[ьъ]?\s*[!:=()Dd]*\s*$/i;
  var pattern = /^\s*[hnн]\s?[eе]\s?[tт][ьъ]?\s*[.,!:=()Dd]*\s*$/i;
  var pattern2 = /^\s*[д]\s?[аa]\s*[.,!:=()Dd]*\s*$/i;
  var pattern3 = /семь[я|ёй|е]|семейный/i;
  var pattern4 = /рофлю/i;
  var pattern5 = /блудный сын вернулся/i;

  var timer = 1100;

  if (pattern.test(msg.text)) {
    try {

      await setTimeout(() => {
        const imageBuffer = fs.readFileSync("./images/goose-pdr.png");
        // bot.sendPhoto(msg.chat.id, imageBuffer);
        bot.sendSticker(msg.chat.id, imageBuffer, {
          reply_to_message_id: msg.message_id
      });
      }, timer);

    } catch (e) {
      console.log('err load image: ' + e);
    }
  } else if (pattern2.test(msg.text)) {
    try {

      await setTimeout(() => {
        const imageBuffer = fs.readFileSync("./images/pizda.png");
        // bot.sendPhoto(msg.chat.id, imageBuffer);
        bot.sendSticker(msg.chat.id, imageBuffer, {
          reply_to_message_id: msg.message_id
      });
      }, timer);

    } catch (e) {
      console.log('err load image: ' + e);
    }
  } else if (pattern3.test(msg.text)) {
    try {

      await setTimeout(() => {
        const imageBuffer = fs.readFileSync("./images/family.png");
        // bot.sendPhoto(msg.chat.id, imageBuffer);
        bot.sendSticker(msg.chat.id, imageBuffer, {
          reply_to_message_id: msg.message_id
      });
      }, timer);

    } catch (e) {
      console.log('err load image: ' + e);
    }
  }
  else if (pattern4.test(msg.text)) {
    try {

      await setTimeout(() => {
        const imageBuffer = fs.readFileSync("./images/rofl.png");
        // bot.sendPhoto(msg.chat.id, imageBuffer);
        bot.sendSticker(msg.chat.id, imageBuffer, {
          reply_to_message_id: msg.message_id
      });
      }, timer);

    } catch (e) {
      console.log('err load image: ' + e);
    }
  }
  else if (pattern5.test(msg.text)) {
    try {

      await setTimeout(() => {
        const imageBuffer = fs.readFileSync("./images/luntik.png");
        // bot.sendPhoto(msg.chat.id, imageBuffer);
        bot.sendSticker(msg.chat.id, imageBuffer);
      }, timer);

    } catch (e) {
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

// const messageUpdate = () => {
//   console.log("Update messages...");
//   // console.log(messagesID);
//   for (let item of messagesID) {
//     // console.log(item);
//     const [chat_id, message_id] = item;

//     try {
//       bot.editMessageText(lastDate, {
//         chat_id,
//         message_id,
//         // parse_mode: "HTML",
//       });
//     } catch (err) {
//       console.log("Не обновилось");
//     }
//   }
// };
