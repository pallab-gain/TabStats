const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const { name } = require('./package');
const commonConfig = require('./webpack.common.config');

function resolve (dir) {
  return path.join(__dirname, dir);
}

const outputDirectory = 'dist';
module.exports = merge(commonConfig, {
  output: {
    filename: `background.js`
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new webpack.DefinePlugin({
      __PRODUCTION__: JSON.stringify(true)
    })
  ]
});
