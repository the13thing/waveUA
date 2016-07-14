window.onload=inicia;

var latitude;
var longitude;

function inicia() {
    navigator.geolocation.getCurrentPosition(function(location) {
        console.log(location.coords.latitude);
        console.log(location.coords.longitude);
        latitude=location.coords.latitude;
        longitude=location.coords.longitude;

        var latitude = "40.6293176";
        var longitude = "-8.6478325";
        var latLong = new google.maps.LatLng(latitude,longitude);

        var mapOptions = {
            center: latLong,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions)
    });

}