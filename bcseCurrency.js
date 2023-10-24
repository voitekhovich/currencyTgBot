const fetch = require("node-fetch");

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
    );
