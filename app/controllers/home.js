const mongoose = require('mongoose');
const Flat = mongoose.model('Flat');
const config = require('../../config/config');

let express = require('express'),
  router = express.Router();

module.exports = app => {
  app.use('/', router);
};

router.get('/', (req, res, next) => {

  Flat.find((err, flats) => {
    if (err) return next(err);

    //return res.json({ flats: flats.join(',') });
    console.log('flats',flats.join(','))
    res.render('index', {
      title: 'Generator-Express MVC',
      flats: JSON.stringify( flats ),
      rootPath: config.host
    });
  });
});

router.get('/createFlat', (req, res, next) => {

  let price = 3500 + Math.ceil( Math.random() * 70 ) * 100;
  let address = 'Av. Libertador '+ Math.ceil( Math.random() * 15000 );
  let lat = -34.5942865 + Math.random() / 20 - Math.random() / 20;
  let lng = -58.4301075 + Math.random() / 20 - Math.random() / 20;


  let flat = new Flat({ price, address, lat, lng });

  console.log('saving flat')
  flat.save( err => {
    if( err ) return res.render( 'index', { title: err } );
    res.render('index',{ title: 'Ok'});
  });

});