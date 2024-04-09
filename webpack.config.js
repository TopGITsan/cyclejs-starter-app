// const argv = require('yargs').argv;
// const CleanupPlugin = require('webpack-cleanup-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require('webpack');

// Environment Constants
// const __BASENAME__ = JSON.stringify(process.env.BASENAME || '');
// const __COVERAGE__ = !argv.watch && __TEST__;
// const API_ENDPOINT = JSON.stringify(process.env.API_ENDPOINT);
// const APP_URL = JSON.stringify(process.env.APP_URL);
const __DEV__ = NODE_ENV === 'development';
const __PROD__ = NODE_ENV === 'production';
const __TEST__ = NODE_ENV === 'test';
const NODE_ENV = process.env.NODE_ENV;

// const GLOBALS = {
//   'process.env': { NODE_ENV: JSON.stringify(NODE_ENV) },
//   __BASENAME__: __BASENAME__
//   __COVERAGE__: __COVERAGE__,
//   __DEV__: __DEV__,
//   __PROD__: __PROD__,
//   __TEST__: __TEST__,
//   NODE_ENV: NODE_ENV,
// };


// Constants
const DIST = path.join(ROOT, "dist");
const ROOT = path.resolve(__dirname);
const SRC = path.join(ROOT, "src");
const PROJECT_PUBLIC_PATH = '/';


const webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: 'source-map',
  resolve: {
    modules: [ SRC, 'node_modules' ],
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
  module: { rules: [] }
};
// Entry
const APP_ENTRY = path.join(SRC, 'index.ts');
webpackConfig.entry = {
  app: [APP_ENTRY],
 
};
// Output
webpackConfig.output = {
  filename: `[name].[hash].js`,
  chunkFilename: '[name].[chunkhash].js',
  path: DIST,
  publicPath: PROJECT_PUBLIC_PATH
};
// Plugins
webpackConfig.plugins = [
  // new webpack.DefinePlugin(GLOBALS),
  // new CleanupPlugin(),
  new HtmlWebpackPlugin({
    template: path.join(SRC, 'index.html'),
    hash: false,
    favicon: path.join(SRC, 'favicon.ico'),
    filename: 'index.html',
    inject: 'body',
    minify: { collapseWhitespace: true }
  }),
  // new CopyWebpackPlugin([
  //   { from: 'src/images', to: 'images' },
  //   { from: 'src/fonts', to: 'fonts' }
  // ])
];
if (__DEV__) {
  debug('Enabling plugins for live development (HMR, NoErrors).')
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
} else if (__PROD__) {
  debug('Enabling plugins for production (OccurrenceOrder & UglifyJS).')
  webpackConfig.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          unused: true,
          dead_code: true,
          warnings: false
        }
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin()
  )
}


// Rules
function addRules(rules) {
  webpackConfig.module.rules = webpackConfig.module.rules.concat(rules);
}
// TypeScript and source maps
addRules([
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
  }
]);

module.exports = webpackConfig;
