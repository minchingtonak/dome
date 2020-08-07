const webpack = require("webpack");
const path = require("path");
const workbox = require("workbox-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./js/dome.js",
  output: {
    path: __dirname + "/static",
    filename: "lib.js",
    libraryTarget: "var",
    library: "Dome",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
        PUBLIC_URL: JSON.stringify("https://start.alecminch.dev"),
      },
    }),
    new workbox.GenerateSW({
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/],
      navigateFallback: "https://start.alecminch.dev/index.html",
      navigateFallbackDenylist: [
        // Exclude URLs starting with /_, as they're likely an API call
        new RegExp("^/_"),
        // Exclude any URLs whose last part seems to be a file extension
        // as they're likely a resource and not a SPA route.
        // URLs containing a "?" character won't be blacklisted as they're likely
        // a route with query params (e.g. auth callbacks).
        new RegExp("/[^/?]+\\.[^/]+$"),
      ],
    }),
  ],
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
