require("dotenv").config();

const currency = require("./currency.js");
const constants = require("./constants.js");
const bot = require("./botSender.js");

const INTERVAL = constants.INTERVAL_UPDATE;

console.log("Start project...");

let lastDate = "";

const getCurrency = () => {
  currency.getCurrency().then((res) => {
    lastDate = res;
    bot.tgBot(res);
  });
};

getCurrency();

setInterval(() => {
  getCurrency();
}, INTERVAL);
