'use strict'
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  controlAddress: 'http://221.237.152.153:8892',
  propertyAddress: 'http://221.237.152.153:8892', 
  // shijianAddress: 'http://10.3.9.213:8890', //humin的接口没有/sc
  shijianAddress: 'http://221.237.152.153:8892',
  // tmpAddress: 'http://10.3.9.166:8899', //临时接口调用
  //发布的ip
  // controlAddress: 'http://110.186.51.162:8892',
  // propertyAddress: 'http://110.186.51.162:8892',
  // shijianAddress: 'http://110.186.51.162:8892',
  
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
          // '/apis':{
          //   target:'http://221.237.152.153:8892',
          //   changeOrigin:true,
          //   pathRewrite:{
          //     '^/apis':''
          //   }
          // },
          '/group': {
            target: 'http://221.237.152.153:8892',
            changeOrigin: true,
          },
          '/approve': {
            target: 'http://221.237.152.153:8892',
            changeOrigin: true,
          },
          '/approve': {
            target: 'http://221.237.152.153:8892',
            changeOrigin: true,
          },
          '/qy': {
            target: 'http://221.237.152.153:8892',
            changeOrigin: true,
          },
          '/apis': {
            target: 'http://221.237.152.153:8892',
            changeOrigin: true,
            pathRewrite:{
              '^/apis':''
            }
          }
          
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 9524, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser:false,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',

    /**
     * You can set by youself according to actual condition
     * You will need to set this if you plan to deploy your site under a sub path,
     * for example GitHub pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then assetsPublicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     */
    assetsPublicPath: '/', // If you are deployed on the root path, please use '/'

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
