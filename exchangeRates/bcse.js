const fetch = require("node-fetch");
const moment = require("moment");

const constants = require("../utils/constants.js");
let url = constants.BCSE_API_SRC;

let settings = { method: "Get" };

exports.getData = () =>
  fetch(url, settings)
    .then((res) => res.json())
    .then((json) => parse(json.tabs[0]))
    // .then((json) => json.today.rows)
    // .then((rows) =>
    //   rows.map((item) => {
    //     return {
    //       name: item.currency,
    //       avg: item.avg,
    //       pct: item.pct > 0 ? "↑" : "↓",
    //     };
    //   })
    // )
    // .then((data) => {
    //   // console.log(data);
    //   const usd = getName(data, 'USD');
    //   const eur = getName(data, 'EUR');
    //   const rub = getName(data, 'RUB');
    //   // console.log(usd); 
    //   return `${usd.name} ${usd.avg} ${usd.pct} ${eur.name} ${eur.avg} ${eur.pct} ${rub.name} ${rub.avg} ${rub.pct} | ${getDateTime()}`
    // })

  const parse = (item) => {
    const data = {
      name: item.name.substr(0, 3),
      curr: item.list.at(-1).value
    }
    console.log(data);
  }

    const getName = (arr, key) => {
      return arr.find(item => item.name === key);
    };

    const getDateTime = () => {
      return moment().format('HH:mm DD.MM');
    }
