require("babel-core").transform("code", {});

const express = require('express'),
  config = require('../config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

mongoose.connect(config.db);
let db = mongoose.connection;
db.on('error', () => {
  throw new Error('unable to connect to database at ' + config.db);
});

let models = glob.sync(config.root + '/app/models/*.js');
models.forEach( (model) => {
  require(model);
});
let app = express();

module.exports = require('../config/express')(app, config);

app.listen(config.port, () => {
  console.log('Express server listening on port ' + config.port);
});
 
