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

var getLocationFromUrl = ( url ) => {
  
  let urlArray = url.split('&');
  let location;

  urlArray.forEach( ( chunk ) => {
  
    let markers = chunk.indexOf('markers') >= 0;
  
    if( markers ){
      let stringLocation = chunk.replace('markers=','');
      location = stringLocation.split(',');
    }

  });
  
  return location;

}

var createFlat = (req, res, next, flatScapped) => {

  let price = flatScapped.price;
  let address = flatScapped.address;
  
  let map = getLocationFromUrl( flatScapped.map );

  if( map && map.length == 2 ){
    var lat = map[0];
    var lng = map[1];
  }

  let flat = new Flat({ price, address, lat, lng });

  flat.save( err => {
    if( err ) console.log('err',err);
    console.log('> New flat:', address, map);
  });

}


//-----------------------
// Not used...
//-----------------------
var geocode = () => {

  var req = https.get( configMaps.geocodeUrl + flat.address + '&key=' + configMaps.apiKey, function(response) {

    var body = '';

    var gotLocation = () => {
      
      body = JSON.parse( body );

      if( body && body.results && body.results.length && body.results[0].geometry ){
      
        let location = body.results[0].geometry.location;

        let lat = location.lat;
        let lng = location.lng;

      }else{
        console.log('> ');
      }

    };
    
    response.on('data', d => {
        body += d;
    });

    response.on('end', gotLocation);

  }).on('error', err => {
    console.error('Error with the request:', err.message);
  });

}






//-----------------------
// ROUTES
//-----------------------

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

router.get('/scrapper', (req, res, next) => {

  var items = [];
  
  osmosis
  .get('http://www.zonaprop.com.ar/departamento-alquiler-belgrano.html')
  .find('.list-posts .post')
  .set({
      'title':     '.post-title > a',
      'price':     '.precio-valor',
  })
  .find('.post-title a')
  .follow('@href')
  .set({
    'address' : '.list-directions li',
    'map' : '.location .clicvermapa img @src'
  })
  .data(function(listing) {
    console.log('>listing',listing);
    listing.price = listing.price.replace( /\s/, '');
    createFlat(req, res, next, listing);
  })
  .log(console.log)
  .error(console.log)
  .debug(console.log)

});

router.get('/createFlat', (req, res, next) => {
  
  let flat = {
    price: 3500 + Math.ceil( Math.random() * 70 ) * 100,
    address: 'Av. Libertador '+ Math.ceil( Math.random() * 6000 )
  }

  createFlat(req, res, next, flat);

});