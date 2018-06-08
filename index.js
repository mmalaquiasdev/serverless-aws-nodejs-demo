const serverless = require('serverless-http');
const api = require('./src/api');

module.exports.handler = serverless(api);
