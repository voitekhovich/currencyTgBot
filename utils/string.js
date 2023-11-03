// [
//   { name: 'USD', value: 3.2008, inf: 0.001 },
//   { name: 'EUR', value: 3.3947, inf: 0.0447 },
//   { name: 'RUB', value: 3.4334, inf: 0.0099 },
//   { name: 'CNY', value: 4.3629, inf: 0.0016 }
// ]

const getText = (obj) => {
  return `${obj.name} ${obj.value} ${obj.inf > 0 ? "↑" : "↓"}`;
};

const toText = (dataArray) => {
  const result = dataArray.map((element) => getText(element));
  return result.join(" ");
};

const toTextOfValues = (dataArray, values = []) => {
  if (!!values) return toText(dataArray);

  const result = [];

  for (let inf of values) {
    try {
      const data = dataArray.find((item) => item.name === inf);
      result.push(getText(data));
    } catch (error) {
      console.log("error");
      // continue
    }
  }

  return result.join(" ");
};

module.exports = { toText, toTextOfValues };
