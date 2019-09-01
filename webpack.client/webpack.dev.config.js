const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.config');

module.exports = merge(commonConfig, {
  devServer: {
    port: 3000,
    open: false,
    disableHostCheck: true,
    writeToDisk: true
  }
});
