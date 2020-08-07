const webpack = require("webpack");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = function (options) {
  const plugins = [];
  plugins.push(
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
        PUBLIC_URL: JSON.stringify("https://start.alecminch.dev"),
      },
    })
  );

  return {
    mode: "production",
    entry: "./js/dome.js",
    output: {
      path: __dirname + "/static",
      filename: "lib.js",
      libraryTarget: "var",
      library: "Dome",
    },
    plugins: plugins,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
      ],
    },
  };
};
