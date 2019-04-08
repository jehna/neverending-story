const path = require("path")

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: "./frontend/index.tsx",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "js/app.js",
    publicPath: "/",
    libraryTarget: "umd"
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  }
}
