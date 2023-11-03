const fs = require("fs");
const constants = require("./constants.js");
const { error } = require("console");

const DATABASE_FILE_NAME = constants.DATABASE_FILE_NAME;

exports.readMapFromFile = () => {
  console.log("Read map from file");
  try {
    const file = fs.readFileSync(DATABASE_FILE_NAME, "utf8");
    // const json = JSON.parse(file);
    const map = new Map();
    JSON.parse(file, (key, value) => {
      key !== "" && map.set(parseInt(key), value);
    });

    // const map = new Map(Object.entries(json));

    console.log(map);

    return new Map(map);
  } catch (error) {
    console.log(error);
    return new Map();
  }
};

exports.saveMapToFile = (map) => {
  console.log("Save map to file...");
  const json = JSON.stringify(Object.fromEntries(map));
  fs.writeFileSync(DATABASE_FILE_NAME, json, "utf8");
};

exports.readFile = (dbFileName) => {
  console.log('Read DB file...');
  if (!fs.existsSync(dbFileName)) {
    console.log(`no such file or directory ${dbFileName}`);
    return new Map();
  }
  try {
    const json = fs.readFileSync(dbFileName, "utf8");
    return !!json ? parseJsonToMap(json) : new Map();
  } catch (error) {
    console.log(error);
  }
};

const parseJsonToMap = (json) => {
  const map = new Map();
  JSON.parse(json, (key, value) => {
    key !== "" && map.set(parseInt(key), value);
  });
  return map;
};
