const jsdom = require("jsdom");
const moment = require("moment");
const constants = require("../utils/constants.js");
const MYFIN_SRC = constants.MYFIN_SRC;

const { JSDOM } = jsdom;

exports.getCurrency = () => {
  
  const rowParse = (row) => {
    return {
      currency: row.cells.item(0).textContent,
      nbrb: row.cells.item(1).textContent,
      buy: row.cells.item(2).textContent,
      sale: row.cells.item(3).textContent,
    };
  };

  const parseData = (data) => {
    let array = [];
    for (let i = 2; i <= 4; i++) {
      array.push(rowParse(data.rows.item(i)));
    }
    return array;
  };

  const getDateTime = () => {
    return moment().format('HH:mm:ss DD.MM');
  }

  const getString = (dataArray) => {
    newArrStr = dataArray.map(
      (element) => `${element.currency} ${element.buy} ' ${element.sale}`
    );
    return newArrStr.join(" | ");
  };

  const getHTMLString = (dataArray) => {
    newArrStr = dataArray.map(
      (element) => `<code>${element.currency}</code> <b>${element.buy}</b> ' <b>${element.sale}</b>`
    );
    return newArrStr.join(" ");
  };

  return JSDOM.fromURL(MYFIN_SRC)
    .then((dom) => {
      return dom.window.document.querySelector("tbody");
    })
    .then((data) => {
      const obj = parseData(data);
      return `${getHTMLString(obj)} | <i>${getDateTime()}</i>`;
    })
    .catch((err) => {
      console.log(err);
    });
};
