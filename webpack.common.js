const path = require('path');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {HashedModuleIdsPlugin} = require('webpack');
var os = require('os')
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});
module.exports = {
  entry: {
    index: ['webpack-hot-middleware/client?noInfo=true&reload=true',path.resolve(__dirname, 'src/index.js')]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/",
    filename: 'assets/js/[name].[hash].js',
    chunkFilename: 'assets/js/[name].[hash].js'
  },
  module: {
    rules: [{
      test: /(\.jsx|\.js)$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ["es2015"]
        }
      },
      exclude: /node_modules/,
      include: '/src/'
    }, {
      test: /(\.css|\.scss|\.sass)$/,
      use: ['css-loader', 'sass-loader', {
        loader: 'postcss-loader',
        options: {
          plugins: () => [require('autoprefixer')({
            'browsers': ['> 1%', 'last 2 versions']
          })]
        }

      }]
    }, {
      test: /\.(gif|jpg|png|ico)\??.*$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: '[name].[ext]',
          publicPath: '../../',
          outputPath: 'assets/css/'
        }
      }
    }, {
      test: /\.(svg|woff|otf|ttf|eot)\??.*$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: '[name].[ext]',
          publicPath: '../../',
          outputPath: 'assets/css/'
        }
      }
    }, {
      test: /\.html$/,
      use: {
        loader: 'html-loader',
        options: {
          minimize: true,
          removeComments: false,
          collapseWhitespace: false
        }
      }
    }]
  },
  plugins: [
    new HappyPack({
      // loaders is the only required parameter:
      id: "js",
      loaders: ['babel-loader'],
      threadPool: happyThreadPool,
      verbose: true
    }),
    //清空dist
    new HashedModuleIdsPlugin(),
    new CleanWebpackPlugin(["dist"], {
      root: '',
      verbose: true,
      dry: false
    }),

    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
      hash: false
    })

  ]
};