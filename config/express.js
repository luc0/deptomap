var express = require('express');
var expressVue = require('express-vue');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
//var nunjucks = require('nunjucks');
var config = require('../config/config');

module.exports = (app, config) => {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  
  app.set('views', config.root + '/app/views');
  // app.set('view engine', 'nunjucks');
  // nunjucks.configure(config.root + '/app/views', {
  //     autoescape: true,
  //     express: app
  // });
  app.set('vue', {
      //ComponentsDir is optional if you are storing your components in a different directory than your views
      componentsDir: __dirname + '/components',
      //Default layout is optional it's a file and relative to the views path, it does not require a .vue extention.
      //If you want a custom layout set this to the location of your layout.vue file.
      defaultLayout: 'layout'
  });
  app.engine('vue', expressVue);
  app.set('view engine', 'vue');

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach( (controller) => {
    require(controller)(app);
  });

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  app.use( (req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(app.get('env') === 'development'){
    app.use( (err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use( (err, req, res, next) => {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

  return app;
};
