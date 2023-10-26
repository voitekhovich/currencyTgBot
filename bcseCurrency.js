const fetch = require("node-fetch");
const moment = require("moment");

const constants = require("./constants.js");
let url = constants.BCSE_API_SRC;

let settings = { method: "Get" };

exports.getData = () =>
  fetch(url, settings)
    .then((res) => res.json())
    .then((json) => json.today.rows)
    .then((rows) =>
      rows.map((item) => {
        return {
          name: item.currency,
          avg: item.avg,
          pct: item.pct > 0 ? "↑" : "↓",
        };
      })
    )
    .then((data) => {
      // console.log(data);
      const usd = getName(data, 'USD');
      const eur = getName(data, 'EUR');
      const rub = getName(data, 'RUB');
      // console.log(usd); 
      return `${usd.name} ${usd.avg} ${usd.pct} ${eur.name} ${eur.avg} ${eur.pct} ${rub.name} ${rub.avg} ${rub.pct} | ${getDateTime()}`
    })

    const getName = (arr, key) => {
      return arr.find(item => item.name === key);
    };

    const getDateTime = () => {
      return moment().format('HH:mm DD.MM');
    }
