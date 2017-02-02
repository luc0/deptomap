{% extends 'layout.nunjucks' %}

{% block content %}


<template>
  <map
    :center="center"
    :zoom="7"
  >
  </map>
</template>


<script>

  import {load, Map, Marker} from 'vue-google-maps'

  load('AIzaSyArDyFoJj9j04gOY0DhQ77bCaU-JxKhTtA')

  export default {
    data () {
      return {
        center: {lat: 10.0, lng: 10.0},
        markers: [{
          position: {lat: 10.0, lng: 10.0}
        }, {
          position: {lat: 11.0, lng: 11.0}
        }]
      }
    }
  }

</script>


{% endblock %}
