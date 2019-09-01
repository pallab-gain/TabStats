const path = require('path');
const { clientMain: main } = require('../package');

function resolve (dir) {
  return path.join(__dirname, dir);
}

const outputDirectory = 'dist';
module.exports = {
  entry: [ 'babel-polyfill', main ],
  output: {
    path: resolve(outputDirectory),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader']
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          modules: true
        }
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  }
};
