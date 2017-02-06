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

  let POSITION_ATTRIBUTE = 'center';
  
  if( url ){

    url = url.replace('?','&');
    let urlArray = url.split('&');
    let location;

    urlArray.forEach( ( chunk ) => {
    
      let markers = chunk.indexOf( POSITION_ATTRIBUTE ) >= 0;
    
      if( markers ){
        let stringLocation = chunk.replace( POSITION_ATTRIBUTE + '=','');
        location = stringLocation.split(',');
      }

    });
    
    return location;

  }else{
    
    return false;

  }

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
  
  if( stringPrice.toLowerCase().indexOf('u$s') >= 0 ){
    return true;
  }
  
  return false;

};

var getTotalPrice = ( arrayPrices ) => {

  let totalPrice = 0;

  arrayPrices.forEach( ( current ) => {

    let currentInDollars = needsConvertion( current.price );
    let price = getNumberFromString( current.price ) || 0;

    if( currentInDollars ){
      price *= DOLLARS_EXCHANGE;
    }

    totalPrice += parseInt( price );
  });

  let priceObject = {};
  priceObject.total = totalPrice;
  priceObject.expenses = hasExpenses( arrayPrices );
  console.log('priceObject.expenses',priceObject.expenses);

  return priceObject;

}

var hasExpenses = ( arrayPrices ) => {
  
    console.log('> arrayPrices',arrayPrices);
  if( arrayPrices.length == 3 && parseInt( getNumberFromString(arrayPrices[2].price) ) > 0 ){
    return true; //arrayPrices[2];
  }
  
  return false;

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

var createFlat = (req, res, next, flatScrapped) => {

  console.log('>> Map',flatScrapped.map);
  console.log('>>',flatScrapped.title);
  // TODO: calcular con expensas, tambien descomentar del scrapper.
  //let priceObject = getTotalPrice( flatScrapped.prices );
  // let price = priceObject.total;
  // let includedExpenses = priceObject.expenses;
  let priceValid = flatScrapped.price1 || flatScrapped.price2;

  let includedExpenses = false;
  let price = getTotalPriceFromString(priceValid);
  let address = flatScrapped.address;
  let m2 = parseInt(flatScrapped.m2) || 0;
  let m2total = parseInt(flatScrapped.m2total) || 0;
  let rooms = parseInt(flatScrapped.rooms) || 0;
  let bathrooms = parseInt(flatScrapped.bathrooms) || 0;
  let realState = flatScrapped.realState;
  let activeDays = getNumberFromString( flatScrapped.activeDays ) || 0;
  let url = flatScrapped.url;
  // console.log('>> m2',flatScrapped.m2);
  // console.log('>> m2total',flatScrapped.m2total);
  // console.log('>> rooms',flatScrapped.rooms);
  // console.log('>> price',price);
  
  let map = getLocationFromUrl( flatScrapped.map );

  if( map && map.length == 2 ){

    var lat = map[0];
    var lng = map[1];

    var position = { lat, lng };

    let toSave = { price, includedExpenses, address, position, m2, m2total, rooms, bathrooms, realState, activeDays, url };

    let flat = new Flat( toSave );

    Flat.update( toSave, { $setOnInsert: flat }, { upsert: true }, err => {
      if( err ) console.log('err',err);
      //console.log('> New flat:', price, address, toSave);
    });

  }else{
    //console.log('> Error: can not parse location from URL :(', flatScrapped);
  }

}


//-----------------------
// Not used...
//-----------------------
var geocode = ( flat ) => {

  var req = https.get( configMaps.geocodeUrl + flat.address + '&key=' + configMaps.apiKey, function(response) {

    var body = '';

    var gotLocation = () => {
      
      body = JSON.parse( body );

      if( body && body.results && body.results.length && body.results[0].geometry ){
      
        let location = body.results[0].geometry.location;

        let lat = location.lat;
        let lng = location.lng;

      }else{
        console.log('> Error: cant get location..');
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

    // No es muy prolijo
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
  
  // http://www.zonaprop.com.ar/inmuebles-alquiler-palermo.html
  // http://www.zonaprop.com.ar/departamento-alquiler-belgrano.html
  // http://www.zonaprop.com.ar/departamento-alquiler-capital-federal.html

  osmosis
  .get('http://www.zonaprop.com.ar/departamento-alquiler-capital-federal.html')
  .follow('.pagination li:not(.pagination-action-prev):not(.pagination-action-next) a @href')
  .delay(2000)
  .find('.list-posts .post')
  .delay(2000)
  .set({
      'title':     '.post-title > a',
      // 'm2':        '.misc .misc-m2cubiertos',
      // 'm2total':   '.misc .misc-m2totales',
      // 'rooms':     '.misc .misc-habitaciones',
      // 'bathrooms': '.misc .misc-banos'
  })
  .delay(2000)
  .find('.post-title a')
  .delay(2000)
  .follow('@href')
  .delay(2000)
  .set({
    // 'prices': [
    //   osmosis
    //     .find('.aviso-datos:first-child li .valor')
    //     .set('price')
    // ],
    /* TODO:  VER como tomar los siguientes datos: rooms, bathroom, m2, m2total, price.  */
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
    //console.log('>listing',listing);
    ////listing.price = listing.price.replace( /\s/, '');
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