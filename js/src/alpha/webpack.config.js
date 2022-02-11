const path = require("path");

module.exports = {
  mode: "production",
  entry: path.join(__dirname, "alpha.js"),
  output: {
    path: path.join(__dirname, "..", ".."),
    filename: "alpha.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
    ],
  },
};
