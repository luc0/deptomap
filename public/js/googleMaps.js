
FLATS = parseJSON( FLATS );

Vue.use(VueGoogleMap, {
  load: {
    'key': 'AIzaSyArDyFoJj9j04gOY0DhQ77bCaU-JxKhTtA'
  },
  // Demonstrating how we can customize the name of the components
  installComponents: false,
});

document.addEventListener('DOMContentLoaded', function() {
    Vue.component('google-map', VueGoogleMap.Map);
    Vue.component('info-window', VueGoogleMap.InfoWindow);
    Vue.component('google-marker', VueGoogleMap.Marker);
    var map = new Vue({
        el: '#mapa',
        data: {
          center: {lat: -34.5942865, lng: -58.4301075},
          markers: FLATS,
          filterPriceMin: 5000,
          filterPriceMax: 9000
        },
        methods:{
          openInfoWindow: function( marker ){
            this.markers.forEach( function(m){
              m.isOpen = false;
            });
            marker.isOpen = true;
          },
          getResultsContent: function(){
            return this.filteredMarkers.length + ' resultados.'
          }
        },
        computed:{
          filteredMarkers: function(){
            var self = this
            return self.markers.filter(function (marker) {
              return (marker.price > self.filterPriceMin) && (marker.price < self.filterPriceMax) 
            })
          }
        }
    });

    var slider = document.getElementById('slider');

    noUiSlider.create(slider, {
      start: [2000, 50000],
      connect: true,
      range: {
        'min': 2000,
        'max': 50000
      }
    });

    var inputNumberMin = document.getElementById('inputFilterPriceMin');
    var inputNumberMax = document.getElementById('inputFilterPriceMax');

    slider.noUiSlider.on('update', function( values, handle ) {

      var value = values[handle];

      if ( handle ) {
        inputNumberMax.value = value;
        map.filterPriceMax = inputNumberMax.value;
      } else {
        inputNumberMin.value = Math.round(value);
        map.filterPriceMin = inputNumberMin.value;
      }

    });

    inputNumberMin.addEventListener('change', function(){
      slider.noUiSlider.set([this.value, null]);
    });

    inputNumberMax.addEventListener('change', function(){
      slider.noUiSlider.set([null, this.value]);
    });


});

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
     .replace(/\&#34;/g, '"')
     .replace(/[\u0000-\u0019]+/g,"");

  return JSON.parse( obj );

}