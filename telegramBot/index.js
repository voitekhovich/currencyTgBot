const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");

const constants = require("../utils/constants.js");
const files = require("../utils/files.js");

const API_KEY_BOT = process.env.API_KEY_BOT;

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

bot.onText(/\/start/, async (msg) => {
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

bot.on('text', async (msg) => {
  
  // var pattern = /^\s*нет[ьъ]?\s*[!:=()Dd]*\s*$/i;
  var pattern = /^\s*[hн]\s?[eе]\s?[tт][ьъ]?\s*[!:=()Dd]*\s*$/i;

  if (pattern.test(msg.text)) {
    try {

      await setTimeout(() => {
        const imageBuffer = fs.readFileSync("./images/goose-pdr.png");
        bot.sendPhoto(msg.chat.id, imageBuffer);
      }, 2000);

    } catch(e) {
      console.log('err load image: ' + e);
    }
  }
});

bot.onText(/\/info/, async (msg) => {
  text = constants.infoBotText;
  bot.sendMessage(msg.chat.id, text, {
    // parse_mode: "HTML",
  });
});

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
