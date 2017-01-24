var map;

FLATS = parseJSON( FLATS );

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
	center: {
		lat: -34.5942865, 
		lng: -58.4301075
	},
	zoom: 12
  });

  FLATS.forEach( function( flat ){

  	if( flat && flat.address && flat.price && flat.lat && flat.lng ){

	  var marker = new google.maps.Marker({
	    position: { lat: flat.lat, lng: flat.lng },
	    map: map,
	    title: flat.address + ' ( $ '+flat.price + ')';
	  });

	}

  });

}

function parseJSON( obj ){
	
	obj = obj.replace(/\\n/g, "\\n")  
	   .replace(/\\'/g, "\\'")
	   .replace(/\\"/g, '\\"')
	   .replace(/\\&/g, "\\&")
	   .replace(/\\r/g, "\\r")
	   .replace(/\\t/g, "\\t")
	   .replace(/\\b/g, "\\b")
	   .replace(/\\f/g, "\\f")
	   .replace(/\&quot;/g, '"')
	   .replace(/[\u0000-\u0019]+/g,"");

	return JSON.parse( obj );

}