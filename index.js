require("dotenv").config();

// const currency = require("./exchangeRates/myfin.js");
const { DATABASE_FILE_NAME } = require("./utils/constants");
const { readFile } = require("./utils/files");
// const bot = require("./telegramBot/index.js");
const bcseCurrency = require("./exchangeRates/bcseHtml");
const { toText, toTextOfValues } = require("./utils/string");

// const INTERVAL = constants.INTERVAL_UPDATE;
// const DATABASE_FILE_NAME = constants.DATABASE_FILE_NAME;

console.log("Start project...");

let dataBase = readFile(DATABASE_FILE_NAME);
let lastDate = "";


// const getCurrency = () => {
//   currency
//     .getCurrency()
//     .then((res) => {
//       lastDate = res;
//       bot.tgBot(res);
//     })
//     .catch((err) => {
//       console.log(err);
//     })
//     .finally(() => {
//       console.log("getCurrency - Done");
//     });
// };

// const getCurrency = () => {
//   bcseCurrency.getData()
//     .then((res) => {
//       lastDate = res;
//       bot.tgBot(res);
//     })
//     .catch((err) => {
//       console.log(err);
//     })
//     .finally(() => {
//       console.log("getCurrency - Done");
//     });
// };

// getCurrency();

// setInterval(() => {
//   getCurrency();
// }, INTERVAL);

bcseCurrency.getData()
  .then((data) => {
    // console.log(toText(data))
    console.log(toTextOfValues(data, []))
  });