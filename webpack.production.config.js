const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, 'app/index.jsx')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name]-[hash].min.js'
  },
  resolve: {
    extensions: ['', '.jsx', '.scss', '.js', '.json'],
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
     template: 'app/index.tpl.html',
     inject: 'body',
     filename: 'index.html'
    }),
    new ExtractTextPlugin('[name]-[hash].min.css'),
    new ExtractTextPlugin('react-toolbox.css', { allChunks: true }),
    new webpack.optimize.UglifyJsPlugin({
         compressor: {
           warnings: false,
           screw_ie8: true
         }
       }),
       new StatsPlugin('webpack.stats.json', {
         source: false,
         modules: false
       }),
       new webpack.DefinePlugin({
         'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
       })
  ],
  module: {
    loaders: [
      {
        test: /(\.js|\.jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
           presets:['es2015','react']
        }
      }, {
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap!toolbox')
      }
    ]
  },
  toolbox: {
    theme: path.join(__dirname, 'app/toolbox-theme.scss')
  },
  postcss: [autoprefixer],

};
