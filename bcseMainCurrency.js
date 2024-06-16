const jsdom = require("jsdom");
const moment = require("moment");
const URL = "https://www.bcse.by";

const { JSDOM } = jsdom;

exports.getData = () => {

  return JSDOM.fromURL(URL)
    .then((dom) => {
      return dom.window.document.querySelector("#currency");
    })
    .then((currencyElement) => {
      return currencyElement.querySelectorAll(".inf-instrument");
    })
    .then((elements) => {
      let array = [];
      elements.forEach((item) => {
        const name = item.childNodes[1].childNodes[1].childNodes[1].textContent.slice(0, 3);
        if (name === 'CNY') return
        const avg = item.childNodes[1].childNodes[3].childNodes[3].textContent;
        const pp = item.childNodes[1].childNodes[5].childNodes[3].textContent.slice(0, 1);
        const pct = pp === '+' ? '↑' : '↓';
        // console.log(name + ' ' + value + ' ' + pp);
        array.push({
          name, avg, pct
        })
      })
      return array;
    })
    .then((arr) => {
      const usd = getName(arr, 'USD');
      const eur = getName(arr, 'EUR');
      const rub = getName(arr, 'RUB');
      return `${usd.name} ${usd.avg} ${usd.pct} ${eur.name} ${eur.avg} ${eur.pct} ${rub.name} ${rub.avg} ${rub.pct} | ${getDateTime()}`
    })
    .catch((err) => {
      console.log(err);
    });
};

const getName = (arr, key) => {
  return arr.find(item => item.name === key);
};

const getDateTime = () => {
  return moment().format('HH:mm DD.MM');
}
