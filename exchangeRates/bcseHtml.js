const jsdom = require("jsdom");
const constants = require("../utils/constants.js");
const BCSE_SRC = constants.BCSE_SRC;

const { JSDOM } = jsdom;

exports.getData = () => {
  
  const parse = (elem) => {
    const element = elem.firstElementChild;
    const asfalt = element.getElementsByClassName("text-asfalt");

    const name = asfalt[0].textContent.substring(0,3);
    // const time = element.getElementsByClassName("inf-date")[0].textContent;
    const value = Number(asfalt[1].textContent);
    // const infPCT = element.getElementsByClassName("text-right")[0].textContent;
    const inf = Number(element.getElementsByClassName("text-right")[1].textContent);

    return {
      name,
      // time,
      value,
      // infPCT,
      inf
    }
  }

  return JSDOM.fromURL(BCSE_SRC)
    .then((dom) => dom.window.document.querySelector("#currency").getElementsByClassName("inf-instrument"))
    .then((data) => {
      const arrs = [];
      for (let elem of data) {
        arrs.push(parse(elem))
      }
      return arrs;
    })
    .catch((err) => {
      console.log(err);
    });
};
