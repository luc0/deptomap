var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'deptomap'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/deptomap-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'deptomap'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/deptomap-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'deptomap'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/deptomap-production'
  }
};

module.exports = config[env];
