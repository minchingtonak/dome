const path = require("path");

module.exports = {
  mode: "production",
  entry: "./js/dome.js",
  output: {
    path: __dirname + "/static",
    filename: "lib.js",
    libraryTarget: "var",
    library: "Dome",
  },
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
