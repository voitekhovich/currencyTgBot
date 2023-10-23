const TelegramBot = require("node-telegram-bot-api");
const constants = require("./constants.js");
const files = require("./files.js");

const API_KEY_BOT = process.env.API_KEY_BOT;

let lastDate = "";
const messagesID = files.readMapFromFile();

exports.tgBot = (text) => {
  lastDate = text;
  messageUpdate();
};

console.log("Start bot...");

const bot = new TelegramBot(API_KEY_BOT, {
  polling: true,
});

bot.setMyCommands(constants.commands);

bot.on("polling_error", (error) => {
  console.log(error.code);
});

bot.onText(/\/start/, async (msg) => {
  const res = await bot.sendMessage(msg.chat.id, lastDate, {
    parse_mode: "HTML",
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

bot.onText(/\/info/, async (msg) => {
  text = constants.infoBotText;
  bot.sendMessage(msg.chat.id, text, {
    parse_mode: "HTML",
  });
});

const messageUpdate = () => {
  console.log("Update messages...");
  for (let item of messagesID) {
    const [chat_id, message_id] = item;

    bot.editMessageText(lastDate, {
      chat_id,
      message_id,
      parse_mode: "HTML",
    });
  }
};
