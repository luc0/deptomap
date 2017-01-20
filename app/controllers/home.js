var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  Flat = mongoose.model('Flat');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Flat.find(function (err, flats) {
    if (err) return next(err);
    res.render('index', {
      title: 'Generator-Express MVC',
      flats: flats
    });
  });
});

router.get('/createFlat', function (req, res, next) {
  var flat = new Flat( { price: 3500 + Math.ceil( Math.random() * 70 ) * 100, address: 'Av. Libertador '+ Math.ceil( Math.random() * 15000 ) } );
  flat.save(function(err){
    if( err ) return res.render( 'index', { title: err } );
    res.render('index',{ title: 'Ok'});
  });
});
