const { error } = require("console");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const ROOT = path.resolve(__dirname);
const DIST = path.join(ROOT, "dist");
const SRC = path.join(ROOT, "src");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(SRC, "index.html"),
      hash: false,
      favicon: path.join(SRC, 'favicon.ico'),
      filename: "index.html",
      inject: "body",
      minify: { collapseWhitespace: true },
    }),
  ],
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: "ts-loader",
        exclude: [path.join(ROOT, "node_modules")],
      },
      {
        test: /\.js$/,
        loader: "source-map-loader",
        enforce: "pre",
        exclude: [path.join(ROOT, "node_modules")],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: `[name].[hash].js`,
    chunkFilename: '[name].[chunkhash].js',
    path: DIST,
  },
  stats: {
    errorDetails: true,
  },
};
