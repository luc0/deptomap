import Flat from '../models/flat';

let express = require('express'),
  router = express.Router();

module.exports = app => {
  app.use('/', router);
};

router.get('/', (req, res, next) => {

  let flat = new Flat();

  flat.find((err, flats) => {
    if (err) return next(err);
    res.render('index', {
      title: 'Generator-Express MVC',
      flats: flats
    });
  });
});

router.get('/createFlat', (req, res, next) => {

  let price = 3500 + Math.ceil( Math.random() * 70 ) * 100;
  let address = 'Av. Libertador '+ Math.ceil( Math.random() * 15000 );

  let flat = new Flat( { price, address } );

  flat.save( err => {
    if( err ) return res.render( 'index', { title: err } );
    res.render('index',{ title: 'Ok'});
  });

});