angular
    .module('waveUA', ['spotify'])
    .config(function (SpotifyProvider) {
        SpotifyProvider.setClientId('d1fa368a055b41bb95664fc3cb7a719e');
        SpotifyProvider.setRedirectUri('http://wave.web.ua.pt/www/callback.html');
        SpotifyProvider.setScope('user-read-private playlist-read-private playlist-modify-private playlist-modify-public');
    })
    .controller('MainController', ['$scope', 'Spotify', function ($scope, Spotify) {

        $scope.searchArtist = function () {
            Spotify.search($scope.searchartist, 'artist').then(function (data) {
                $scope.artists = data.artists.items;
            });
        };
        $scope.showProfile = function () {
            Spotify.getCurrentUser().then(function (data) {

            });
        };
        $scope.login = function () {
            Spotify.login().then(function (data) {
                Spotify.getCurrentUser().then(function (data) {
                    $("#profile_name").append(data.display_name);
                    $("#profile_country").append(data.country);
                    $("#profile_image").attr("src",data.images[0].url);
                    $("#profileSide").attr("src",data.images[0].url);
                    $("#profileName").append(data.display_name);

                });
                mainView.router.load({pageName: 'index'});

            }, function () {
                mainView.router.load({pageName: 'index'});
                console.log('didn\'t log in');
            })
        };
        /*
         // Gets an album
         Spotify.getAlbum('0sNOF9WDwhWunNAHPD3Baj').then(function (data){
         console.log('=================== Album - ID ===================');
         console.log(data);
         });
         // Works with Spotify uri too
         Spotify.getAlbum('spotify:album:0sNOF9WDwhWunNAHPD3Baj').then(function (data){
         console.log('=================== Album - Spotify URI ===================');
         console.log(data);
         });

         //Get multiple Albums
         Spotify.getAlbums('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37').then(function (data) {
         console.log('=================== Albums - Ids ===================');
         console.log(data);
         });
         Spotify.getAlbums(['41MnTivkwTO3UUJ8DrqEJJ','6JWc4iAiJ9FjyK0B59ABb4','6UXCm6bOO4gFlDQZV5yL37']).then(function (data) {
         console.log('=================== Albums - Array ===================');
         console.log(data);
         });


         Spotify.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ').then(function (data) {
         console.log('=================== Album Tracks - ID ===================');
         console.log(data);
         });
         Spotify.getAlbumTracks('spotify:album:41MnTivkwTO3UUJ8DrqEJJ').then(function (data) {
         console.log('=================== Album Tracks - Spotify URI ===================');
         console.log(data);
         });



         //Artist
         Spotify.getArtist('0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
         console.log('=================== Artist - Id ===================');
         console.log(data);
         });
         Spotify.getArtist('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
         console.log('=================== Artist - Spotify URI ===================');
         console.log(data);
         });

         Spotify.getArtistAlbums('0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
         console.log('=================== Artist Albums - Id ===================');
         console.log(data);
         });

         Spotify.getArtistAlbums('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
         console.log('=================== Artist Albums - Spotify URI ===================');
         console.log(data);
         });

         Spotify.getArtistTopTracks('0LcJLqbBmaGUft1e9Mm8HV', 'AU').then(function (data) {
         console.log('=================== Artist Top Tracks Australia ===================');
         console.log(data);
         });

         Spotify.getRelatedArtists('0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
         console.log('=================== Get Releated Artists ===================');
         console.log(data);
         });


         //Tracks
         Spotify.getTrack('0eGsygTp906u18L0Oimnem').then(function (data) {
         console.log('=================== Track ===================');
         console.log(data);
         });

         Spotify.getTracks('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G').then(function (data) {
         console.log('=================== Tracks - String ===================');
         console.log(data);
         });

         Spotify.getTracks(['0eGsygTp906u18L0Oimnem','1lDWb6b6ieDQ2xT7ewTC3G']).then(function (data) {
         console.log('=================== Tracks - Array ===================');
         console.log(data);
         });*/

    }]);

//Transform JSON into string
Template7.registerHelper('stringify', function (context){
    var str = JSON.stringify(context);
    return str.replace(/'/g, '&#39;');
});


//Check if player has source (localStorage)
var mediaStorage = window.localStorage;
var playerHtml = document.getElementById("player");
var spotifyLink = document.getElementById("spotifyLink");
var playerImage = document.getElementById("");
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
// Artist Item Page Handling
myApp.onPageInit('artist', function (page) {
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
    $$(page.container).find('.preview').on('click', function (e) {
        mediaStorage.setItem("playerUrl",item.preview_url);
        mediaStorage.setItem("playerExt",item.external_urls.spotify);
        playerHtml.pause();
        playerHtml.setAttribute("src",mediaStorage.getItem("playerUrl"));
        playerHtml.play();
        spotifyLink.setAttribute("href",mediaStorage.getItem("playerExt"));
    });
});


// Side Menu Handlers
$$(document).on('click', '#about', function (e) {
    myApp.alert('Show About');
});
$$(document).on('click', '#mapMenu', function(e){
    mainView.router.load({pageName: 'map'});
    initMap();

});
$$(document).on('click', '#feedMenu', function(e){
    mainView.router.load({pageName: 'feed'});
});
$$(document).on('click', '#indexMenu', function(e){
    mainView.router.load({pageName: 'index'});
});
$$(document).on('click', '#settingsMenu', function(e){
    mainView.router.load({pageName: 'settings'});
    $(document).ready(function() {
        $.getJSON("http://wave.web.ua.pt/www/db/json.php",function(result){
            $.each(result, function(i, field){
                $("#dbDisplay").append(field.album + "<br/>");
            });
        });
    });

});
$$(document).on('click', '#profileMenu', function(e){
    mainView.router.load({pageName: 'profile'});

});
//ON PAGE LOADINGS:

// DATABASE
myApp.onPageInit ('settings', function (page) {

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
        var onError = function(error){var options = {
            zoom: 15,
            center: {lat: -34.397, lng: 150.644},
            mapTypeControl: false,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.SMALL
            }

        };
            var map = new google.maps.Map(document.getElementById('map-canvas'), options);
            var marker = new google.maps.Marker({
                position: {lat: -34.397, lng: 150.644},
                map: map,
                title: "You are here!"
            });
            window.alert('Code:'+error.code+'\n'+'message:'+error.message+'\n');
        };
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            $$(document).on('deviceready', function() {
                navigator.geolocation.getCurrentPosition(onSuccess,onError, {timeout: 10000, enableHighAccuracy: true});
            });        }
        else {
            navigator.geolocation.getCurrentPosition(onSuccess,onError, {timeout: 10000, enableHighAccuracy: true});
        }


    }
//OPEN WINDOWS IN POPUP (GOOD FOR DATABASE STUFF)
function popupform(myform, windowname)
{
    if (! window.focus)return true;
    window.open('', windowname, 'height=200,width=400,scrollbars=no');
    myform.target=windowname;
    return true;
}
