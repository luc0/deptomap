
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
