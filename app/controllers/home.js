const mongoose = require('mongoose');
const Flat = mongoose.model('Flat');
const config = require('../../config/config');
const configMaps = require('../../config/configMaps');
const https = require('https');

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

router.get('/createFlat', (req, res, next) => {

  let price = 3500 + Math.ceil( Math.random() * 70 ) * 100;
  let address = 'Av. Libertador '+ Math.ceil( Math.random() * 6000 );

  var req = https.get( configMaps.geocodeUrl + address + '&key=' + configMaps.apiKey, function(response) {

    var body = '';

    var gotLocation = () => {
      
      body = JSON.parse( body );
      
      let location = body.results[0].geometry.location;

      let lat = location.lat;
      let lng = location.lng;

      let flat = new Flat({ price, address, lat, lng });

      flat.save( err => {
        if( err ) return res.render( 'index', { title: err } );
        console.log('> New flat:', address, location);
        return res.json({ created: flat })
      });

    };
    
    response.on('data', d => {
        body += d;
    });

    response.on('end', gotLocation);

  }).on('error', err => {
    console.error('Error with the request:', err.message);
  });

});