const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const napi = require("../utils/nekosaapi");
const nbestapi = require("../utils/nekosbest");


exports.getUrlFromMessage = (message) => {
  const urlRegex = /(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/gm;
  const found = message.match(urlRegex);
  return found ? found[0] : null;
};

exports.getDataFromDOM = (url) => {
  return JSDOM.fromURL(url)
    .then((dom) => {
      const header = dom.window.document.querySelector(".summary-text").firstElementChild.textContent;
      const elements = dom.window.document.querySelector(".summary-text").lastElementChild.childNodes;

      let content = '';

      for (let elem of elements) {
        content += `\n${elem.textContent}`;
      }

      return `<b>${header}</b>\n${content}`;
    })
}

exports.getRandomImage = () => {
  return napi.request()
    .then(data => data)
    .catch((err) => {
      return nbestapi.request()
      .then(data => data)
    })
    .catch(err => {
      log('getRandomImage error:\n' + err)
      throw err;
    });
};
