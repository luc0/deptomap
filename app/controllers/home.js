const mongoose = require('mongoose');
const Flat = mongoose.model('Flat');
const config = require('../../config/config');
const configMaps = require('../../config/configMaps');
const https = require('https');
const osmosis = require('osmosis');

let express = require('express'),
  router = express.Router();

module.exports = app => {
  app.use('/', router);
};

router.get('/', (req, res, next) => {

  Flat.find((err, flats) => {
    if (err) return next(err);

    console.log('flats',flats.join(','))
    res.render('index', {
      title: 'Mapa',
      flats: JSON.stringify( flats ),
      rootPath: config.host,
      googleApiKey: configMaps.apiKey
    });
  });
});

router.get('/scraper', (req, res, next) => {

  var items = [];

  osmosis
  .get('http://www.zonaprop.com.ar/departamento-alquiler-capital-federal.html')
  .find('.list-posts .post')
  .set({
      'title':     '.post-title > a',
      'address':   '.post-text-location span',
      'price':     '.precio-valor',
  })
  .data(function(listing) {
    listing.price = listing.price.replace( /\s|\./, '');
    createFlat(req, res, next, listing);
  })
  .log(console.log)
  .error(console.log)
  .debug(console.log)

});

var createFlat = (req, res, next, flat) => {

  let price = flat.price;
  let address = flat.address;

  var req = https.get( configMaps.geocodeUrl + flat.address + '&key=' + configMaps.apiKey, function(response) {

    var body = '';

    var gotLocation = () => {
      
      body = JSON.parse( body );
      
      let location = body.results[0].geometry.location;

      let lat = location.lat;
      let lng = location.lng;

      let flat = new Flat({ price, address, lat, lng });

      flat.save( err => {
        if( err ) console.log('err',err);
        console.log('> New flat:', address, location);
        //return cb();
      });

    };
    
    response.on('data', d => {
        body += d;
    });

    response.on('end', gotLocation);

  }).on('error', err => {
    console.error('Error with the request:', err.message);
  });
}

router.get('/createFlat', (req, res, next) => {
  
  let flat = {
    price: 3500 + Math.ceil( Math.random() * 70 ) * 100,
    address: 'Av. Libertador '+ Math.ceil( Math.random() * 6000 )
  }

  createFlat(req, res, next, flat);

});