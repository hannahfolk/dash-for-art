import path from "path";
const { NODE_ENV } = process.env;
let keys = "";

if (NODE_ENV === "development") {
  keys = require("dotenv").config({
    path: path.join(__dirname, "../.env.development"),
  });
} else if (NODE_ENV === "stage") {
  keys = require("dotenv").config({
    path: path.join(__dirname, "../.env.stage"),
  });
} else if (NODE_ENV === "production") {
  keys = require("dotenv").config({
    path: path.join(__dirname, "../.env.production"),
  });
}

module.exports = keys;
