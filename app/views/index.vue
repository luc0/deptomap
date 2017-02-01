{% extends 'layout.nunjucks' %}

{% block content %}



<template>
  <div>
    <ol>
      <li v-for="flat in flats" v-if="flat.price == '8700'">
        {{ flat.price }}
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}

</script>

{% endblock %}
