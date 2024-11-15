// config/webpack.dev.ts
const { merge } = require("webpack-merge");
const common = require("./webpack.common.ts");
const Dotenv = require("dotenv-webpack");
const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    historyApiFallback: true,
    static: path.resolve(__dirname, "../dist"),
    port: 3000,
    open: true,
  },
  plugins: [
    new Dotenv({
      path: ".env.development",
    }),
    new ReactRefreshWebpackPlugin(),
  ],
});
