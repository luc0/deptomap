const mongoose = require('mongoose');
const Flat = mongoose.model('Flat');
const config = require('../../config/config');
const configMaps = require('../../config/configMaps');
const https = require('https');
const osmosis = require('osmosis');

let express = require('express'),
  router = express.Router();

const DOLLARS_EXCHANGE = 16;

module.exports = app => {
  app.use('/', router);
};


var getLocationFromUrl = ( url ) => {

  if( !url ) return false;
  
  let POSITION_ATTRIBUTE = 'center';

  url = url.replace('?','&');
  let urlArray = url.split('&');
  let location;

  urlArray.forEach( ( chunk ) => {
  
    let markers = chunk.indexOf( POSITION_ATTRIBUTE ) >= 0;
  
    if( !markers ) return;
    
    let stringLocation = chunk.replace( POSITION_ATTRIBUTE + '=','');
    location = stringLocation.split(',');

  });
  
  return location;

}

var getNumberFromString = ( currentString ) => {

  if( typeof currentString === 'string' ){
    let clearDot = currentString.replace( /\./, '');
    let number = parseFloat(clearDot.match(/-*[0-9]+/));
    return number;
  }

  return;

};

var needsConvertion = ( stringPrice ) => {
  
  return ( stringPrice.toLowerCase().indexOf('u$s') >= 0 );

};

var getTotalPriceFromString = function( currentPrice ){

    if( !currentPrice ) return 0;

    let currentInDollars = needsConvertion( currentPrice );
    let price = getNumberFromString( currentPrice ) || 0;

    if( currentInDollars ){
      price *= DOLLARS_EXCHANGE;
    }

    return parseInt( price );

}

var cleanData = ( flatScrapped ) => {

  let priceValid = (flatScrapped.price1 || flatScrapped.price2),
      includedExpenses = false,
      price = getTotalPriceFromString(priceValid),
      address = flatScrapped.address,
      m2 = parseInt(flatScrapped.m2) || 0,
      m2total = parseInt(flatScrapped.m2total) || 0,
      rooms = parseInt(flatScrapped.rooms) || 0,
      bathrooms = parseInt(flatScrapped.bathrooms) || 0,
      realState = flatScrapped.realState,
      activeDays = getNumberFromString( flatScrapped.activeDays ) || 0,
      url = flatScrapped.url,
      map = getLocationFromUrl( flatScrapped.map ),
      lat = 0,
      lng = 0,
      position = {};

  if( !map && map.length != 2 ){
    console.log('> Error: can not parse location from URL :(', flatScrapped);
    return;
  }

  lat = map[0],
  lng = map[1];

  position = { lat, lng };

  return { price, includedExpenses, address, position, m2, m2total, rooms, bathrooms, realState, activeDays, url }

}

var createFlat = (req, res, next, flatScrapped) => {

  // TODO: calcular con expensas, tambien descomentar del scrapper.

  let toSave = cleanData( flatScrapped );

  if( !toSave ) return;
    
  let flat = new Flat( toSave );

  Flat.update( toSave, { $setOnInsert: flat }, { upsert: true }, err => {
    if( err ) console.log('err',err);
  });

}





//-----------------------
// ROUTES
//-----------------------

router.get('/', (req, res, next) => {

  Flat.find((err, flats) => {
    if (err) return next(err);

    // Could be better
    var changedFlats = [];
    flats.forEach( flat => {
      flat.isOpen = false;
      changedFlats.push( flat )
    });

    res.render('index', {
        title: 'Mapa',
        flats: JSON.stringify( changedFlats ),
        rootPath: config.host,
        googleApiKey: configMaps.apiKey
    });
  });
});

router.get('/scrapper', (req, res, next) => {
  
  var items = [];

  osmosis
  .get('http://www.zonaprop.com.ar/departamento-alquiler-capital-federal.html')
  .follow('.pagination li:not(.pagination-action-prev):not(.pagination-action-next) a @href')
  .delay(2000)
  .find('.list-posts .post')
  .delay(2000)
  .set({
      'title':     '.post-title > a',
  })
  .delay(2000)
  .find('.post-title a')
  .delay(2000)
  .follow('@href')
  .delay(2000)
  .set({
    'rooms':     '.card-content span:has(.licon-ambientes)',
    'bathrooms': '.card-content span:has(.licon-banos)',
    'm2':        '.card-content span:has(.licon-superficie_cubierta)',
    'm2total':   '.card-content span:has(.licon-superficie_total)',
    'price1':     '.h2.precios strong',
    'price2':     '.h2.precios span.valor',
    'address':    '.list-directions li',
    'map':        '.location .clicvermapa img @src',
    'realState':  '.datos-inmobiliaria-title',
    'activeDays': '.aviso-datos-anunciante ul li:last-child .valor',
    'url':        'meta[property="og:url"] @content'
  })
  .delay(2000)
  .data(function(listing) {
    createFlat(req, res, next, listing);
  })
  .log(console.log)
  .error(console.log)
  .debug(console.log)

});