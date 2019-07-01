'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
   // BASE_API: '"https://api-dev"'
   BASE_API: '"http://localhost:9528/apis"',
   BASE_IMG_URL: '"http://localhost:9528"',
})
