var map;
const MAX_ACTIVE_DAYS = 180;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
	center: {
		lat: -34.5942865, 
		lng: -58.4301075
	},
	zoom: 12
  });

  if( FLATS ){
	  
		FLATS = parseJSON( FLATS );

	  FLATS.forEach( function( flat ){

	  	if( flat && flat.address && flat.price && flat.lat && flat.lng && flat.m2 && flat.realState ){
	  		
	  		if( flat.activeDays && parseInt(flat.activeDays) > MAX_ACTIVE_DAYS ){
	  			return;
	  		}

			  var marker = new google.maps.Marker({
			    position: { lat: flat.lat, lng: flat.lng },
			    map: map
			  });

			  var infoHTML = '<div><h2>' + flat.address + '</h2><h3>' + flat.price + '</h3><strong>' + flat.realState  + '</strong><ul><li>' + flat.m2 + '</li><li>' + flat.m2total + '</li><li>' + flat.rooms + '</li><li>' + flat.bathrooms + '</li><li>' + flat.activeDays + ' días activo</li><ul></div>';

			  var infoWindow = new google.maps.InfoWindow({
		        content: infoHTML
		    });

		    google.maps.event.addListener(marker, 'click', function () {
		        infoWindow.open(map, marker);
		    });

			}

	  });

	}

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