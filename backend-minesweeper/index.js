const handler = require('serverless-http')
const app = require('./app')

module.exports.server = handler(app)
