// webpack.config.ts
const environment = process.env.NODE_ENV || "development";

if (environment === "production") {
  module.exports = require("./config/webpack.prod.ts");
} else {
  module.exports = require("./config/webpack.dev.ts");
}
