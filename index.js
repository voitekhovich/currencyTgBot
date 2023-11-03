require("dotenv").config();

const { DATABASE_FILE_NAME, INTERVAL_UPDATE } = require("./utils/constants");
const { readFile } = require("./utils/files");
const bot = require("./telegramBot/index.js");
const bcseCurrency = require("./exchangeRates/bcseHtml");
const { toTextOfValues } = require("./utils/string");

console.log("Start project...");

let lastDate = "";

const getCurrency = () => {
  bcseCurrency.getData()
    .then((res) => {
      lastDate = toTextOfValues(res, ['USD','EUR','RUB'], true);
      console.log(lastDate);
      bot.tgBot(lastDate);
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
}, INTERVAL_UPDATE);

// bcseCurrency.getData()
//   .then((data) => {
//     console.log(data)
//     console.log()
//     // let res = toTextOfValues(data, []);
//     // lastDate = res;
//     // bot.tgBot(res);
//   });
