require("dotenv").config();
const logger = require("morgan");

module.exports = {
  init(app) {
    app.use(logger("dev"));
  }
};
