import Flat from '../models/flat';

var express = require('express'),
  router = express.Router();

module.exports = app => {
  app.use('/', router);
};

router.get('/', (req, res, next) => {

  var flat = new Flat();

  flat.find((err, flats) => {
    if (err) return next(err);
    res.render('index', {
      title: 'Generator-Express MVC',
      flats: flats
    });
  });
});

router.get('/createFlat', (req, res, next) => {
  var flat = new Flat( { price: 3500 + Math.ceil( Math.random() * 70 ) * 100, address: 'Av. Libertador '+ Math.ceil( Math.random() * 15000 ) } );
  flat.save( err => {
    if( err ) return res.render( 'index', { title: err } );
    res.render('index',{ title: 'Ok'});
  });
});


//module.exports = Controller;