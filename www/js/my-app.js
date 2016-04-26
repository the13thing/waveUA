//Transform JSON into string
Template7.registerHelper('stringify', function (context){
    var str = JSON.stringify(context);
    return str.replace(/'/g, '&#39;');
});

//Check if player has source (localStorage)
var mediaStorage = window.localStorage;
var playerHtml = document.getElementById("player");
var spotifyLink = document.getElementById("spotifyLink");
var playerImage = document.getElementById("")
//If player has no source do nothing
if (mediaStorage.getItem("playerUrl")===null){
}
else {
    playerHtml.setAttribute("src",mediaStorage.getItem("playerUrl"));
    spotifyLink.setAttribute("href",mediaStorage.getItem("playerExt"));
}

// Initialize your app
var myApp = new Framework7({
    precompileTemplates: true,
    template7Pages: true,
    modalTitle: "WaveUA"
});

// Export selectors engine (jQuery like)
var $$ = Dom7;

// Add views
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
    domCache: true
});
// Handle Range Slider
// - This function displays the value next to the slider as it slides for better visual indicator
$$(document).on('input change', 'input[type="range"]', function (e) {
    $$('input#sliderVal').val(this.value);
});

// Handle the Cordova deviceready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

// Handle Submit Button
// - This function calls the Spotify Web API with the designated search options then loads the list
// page when a response is received.
$$(document).on('click', '#btnSearch', function (e) {
    var term = $$("#term").val();
    if (term.length==0) {
        myApp.alert("Please enter a search term.");
    }
    else {
        var mediaType = $("#searchTerms").val();
        var numResults = $$("#numResults").val();

        var url = "https://api.spotify.com/v1/search?q=" + term +"&type=" + mediaType + "&limit=" + numResults;
        //different types of search (track/artist/album)
        if (mediaType=="track") {
            $$.ajax({
                dataType: 'json',
                url: url,
                success: function (resp) {
                    mainView.router.load({
                        template: Template7.templates.listTemplate,
                        context: resp.tracks.items
                    });
                },
                error: function (xhr) {
                    console.log("Error on ajax call " + xhr);
                }
            });
        }
        else if (mediaType=="artist"){
            $$.ajax({
                dataType: 'json',
                url: url,
                success: function (resp) {
                    mainView.router.load({
                        template: Template7.templates.artistTemplate,
                        context: resp.artists.items
                    });
                },
                error: function (xhr) {
                    console.log("Error on ajax call " + xhr);
                }
            });
        }
        else {
            $$.ajax({
                dataType: 'json',
                url: url,
                success: function (resp) {
                    mainView.router.load({
                        template: Template7.templates.albumTemplate,
                        context: resp.albums.items
                    });
                },
                error: function (xhr) {
                    console.log("Error on ajax call " + xhr);
                }
            });
        }
    }


});

// Media List Page Handling
//FAVOURITE/PLAYLIST SLIDE FUNCTION
myApp.onPageInit('list', function (page) {
    $$(page.container).find('.favorite').on('click', function (e) {
        // this.dataset.item returns current index of item clicked so we can retrieve from context
        var item = page.context[this.dataset.item];
        myApp.alert(item.name + ' added to favorites!');
    });
//PREVIEW SLIDE FUNCTION
    $$(page.container).find('.preview').on('click', function (e) {
        var item = page.context[this.dataset.item];
        mediaStorage.setItem("playerUrl",item.preview_url);
        mediaStorage.setItem("playerExt",item.external_urls.spotify);
        playerChange();
    });

//SHARE SLIDE FUNCTION
    $$(page.container).find('.share').on('click', function (e) {
        var item = page.context[this.dataset.item];

        if (window.plugins && window.plugins.socialsharing) {
            window.plugins.socialsharing.share("Hey! My new favorite song is " + item.name + " check it out!",
                'Check this out', item.album.images[2].url, item.preview_url,
                function () {
                    console.log("Share Success")
                },
                function (error) {
                    console.log("Share fail " + error)
                });
        }
        else myApp.alert("Share plugin not found");
    });
});

// Media Item Page Handling
myApp.onPageInit('media', function (page) {
    var item = page.context;

//Event Listener for Player Music Change
    document.getElementById("playerBtn").addEventListener("click",playerUpdate);
    document.getElementById("playerBtn").addEventListener("click",playerChange);
//Changes the player info (only called on user click (play))
    function playerUpdate(){
        mediaStorage.setItem("playerUrl",item.preview_url);
        mediaStorage.setItem("playerExt",item.external_urls.spotify);
    }
    //Updates the player info (only called on "play" inside a search)
    function playerChange (){
        playerHtml.pause();
        playerHtml.setAttribute("src",mediaStorage.getItem("playerUrl"));
        playerHtml.play();
        spotifyLink.setAttribute("href",mediaStorage.getItem("playerExt"));
    }

    $$(page.container).find('.share').on('click', function (e) {
        if (window.plugins && window.plugins.socialsharing) {
            window.plugins.socialsharing.share("Hey! My new favorite song is " + item.name + " check it out!",
                'Check this out', item.album.images[2].url, item.preview_url,
                function () {
                    console.log("Share Success")
                },
                function (error) {
                    console.log("Share fail " + error)
                });
        }
        else myApp.alert("Share plugin not found");
    });
    $$(page.container).find('.favorite').on('click', function (e) {
        myApp.alert(item.name + ' added to favorites!');
    });
});


// Side Menu Handlers
$$(document).on('click', '#about', function (e) {
    myApp.alert('Show About');
});
//ON PAGE LOADINGS:

// DATABASE
myApp.onPageInit ('settings', function (page) {
    $(document).ready(function() {
        $.getJSON("http://localhost/waveua/www/db/json.php",function(result){
            $.each(result, function(i, field){
                $("#dbDisplay").append(field.name + "<br/>");
            });
        });
    });
});
// MEDIA PLAYLISTS
myApp.onPageInit ('media', function (page) {
    $(document).ready(function() {
        $.getJSON("http://localhost/waveua/www/db/json.php",function(result){
            $.each(result, function(i, field){
                $("#playlist").append("<option value= ''>"+field.name+"</option>");
            });
        });
    });
});

// MAP AND GEOLOCATION
myApp.onPageInit('map', function (page) {
    initMap();
    function initMap() {
        var onSuccess = function(position) {
            var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var options = {
                zoom: 15,
                center: coords,
                mapTypeControl: false,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.SMALL
                }

            };
            var map = new google.maps.Map(document.getElementById('map-canvas'), options);
            var marker = new google.maps.Marker({
                position: coords,
                map: map,
                title: "You are here!"
            });
        };
        var onError = function(error){
            window.alert('Code:'+error.code+'\n'+'message:'+error.message+'\n');
        };
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            $$(document).on('deviceready', function() {
                navigator.geolocation.getCurrentPosition(onSuccess,onError, {timeout: 10000, enableHighAccuracy: true});
            });        }
        else {
            navigator.geolocation.getCurrentPosition(onSuccess,onError);
        }


    }
});
//OPEN WINDOWS IN POPUP (GOOD FOR DATABASE STUFF)
function popupform(myform, windowname)
{
    if (! window.focus)return true;
    window.open('', windowname, 'height=200,width=400,scrollbars=yes');
    myform.target=windowname;
    return true;
}

//Angular Spotify Module
angular
    .module('waveUA', ['spotify'])
    .config(function (SpotifyProvider) {
        SpotifyProvider.setClientId('123456789123456789');
        SpotifyProvider.setRedirectUri('http://example.com/callback.html');
        SpotifyProvider.setScope('playlist-read-private');
    })