require("dotenv").config();

const currency = require("./myfinCurrency.js");
const constants = require("./constants.js");
const bot = require("./botSender.js");
const bcseCurrency = require("./bcseCurrency.js");

const INTERVAL = constants.INTERVAL_UPDATE;

console.log("Start project...");

let lastDate = "";

const getCurrency = () => {
  currency
    .getCurrency()
    .then((res) => {
      lastDate = res;
      bot.tgBot(res);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      console.log("getCurrency - Done");
    });
};

getCurrency();

setInterval(() => {
  getCurrency();
}, INTERVAL);

bcseCurrency.getData().then((data) => console.log(data));
