<template>
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <script src="js/vue.js" charset="utf-8"></script>
        </head>
        <body>

            {{{app}}}
            {{{script}}}

            <script type="text/javascript">
                var FLATS = [{lat:-34.578159399999996992,lng:-58.43335869999999943}]
            </script>
            <script type="text/javascript" src="js/googleMaps.js"></script>
            <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyArDyFoJj9j04gOY0DhQ77bCaU-JxKhTtA&callback=initMap"></script>

            <script src="js/vue-google-maps.js"></script>
        </body>
    </html>
</template>

<script>
</script>

<style>
</style>