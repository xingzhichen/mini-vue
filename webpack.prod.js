const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[hash].min.css',
      chunkFilename: 'assets/css/[name].[hash].css'
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            booleans: false,
            collapse_vars: true,
            reduce_vars: true,
            loops: true
          },
          output: {
            comments: false,
            beautify: false
          }
        }
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/,
        cssProcessor: require('cssnano')({zindex: false}),
        cssProcessorOptions: {
          discardComments: {removeAll: true}
        },
        canPrint: false
      }, {
        copyUnmodified: true
      })
    ]
  }
});