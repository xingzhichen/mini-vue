const path = require("path")
const express = require("express")
const webpack = require("webpack")
const opn = require('opn')

const webpackDevMiddleware = require("webpack-dev-middleware")
const webpackHotMiddleware = require("webpack-Hot-middleware")
const webpackConfig = require('./webpack.dev.js')

const app = express(),
    DIST_DIR = path.join(__dirname, "dist"), // 设置静态访问文件路径
    PORT = 9090, // 设置启动端口
    complier = webpack(webpackConfig)


let devMiddleware = webpackDevMiddleware(complier, {
  publicPath: webpackConfig.output.publicPath,
  noInfo: true,
  quiet: false,
  lazy: false,
  watchOptions: {
    poll: true
  },
  stats: {
    colors: true
  }})

let hotMiddleware = webpackHotMiddleware(complier,{
  log: false,
  heartbeat: 2000,
})
app.use(devMiddleware)

app.use(hotMiddleware);


app.use(express.static(DIST_DIR))
app.listen(PORT,function(){
  console.log("成功启动：localhost:"+ PORT)
  opn(`http://localhost:${PORT}`)
})