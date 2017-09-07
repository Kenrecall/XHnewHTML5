/**
 * Created by way on 16/6/11.
 */

var webpack = require('webpack');

module.exports = {
  entry: {flightmb: './src/flightmb.js'},
  output: {
    // path: __dirname,
    path: 'D:/prj/flightmb/dist/js',
    // filename: 'bundle.js'
    filename: '[name].js'
  },
  externals: {
    // Zepto: 'Zepto',
    EditTable: 'EditTable'
  },
  module: {
    //加载器配置
    loaders: [
      // {test: /\.js$/, loader: 'babel', exclude: /(node_modules|src\/lib)/},
      {test: /\.js$/, loader: 'babel', exclude: /(node_modules)/}
    ]
  },
  // 其它解决方案配置
  resolve: {
    extensions: ['', '.js']
  }
};
