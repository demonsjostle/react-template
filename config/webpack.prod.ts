// config/webpack.prod.ts
const { merge } = require("webpack-merge");
const common = require("./webpack.common.ts");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const Dotenv = require("dotenv-webpack");
module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [
    new Dotenv({
      path: ".env.production",
    }),
  ],
});
