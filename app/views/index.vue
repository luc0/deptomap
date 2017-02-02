{% extends 'layout.nunjucks' %}

{% block content %}


<template>
  <div>
    <ol>
      <li v-for="flat in even(flats, filterPrice)">
        {{ flat.price }}
      </li>
    </ol>
    <input type="text" v-model="filterPrice"/>
  </div>
</template>

<script>

export default {
  data () {
    return {}
  },
  methods: {
    even: function (flats, filterPrice) {
      return flats.filter(function (flat) {
        return flat.price < filterPrice
      })
    }
  }
}

</script>

{% endblock %}
