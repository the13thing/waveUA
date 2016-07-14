angular
    .module('waveUA', ['spotify'])
    .config(function (SpotifyProvider) {
        SpotifyProvider.setClientId('d1fa368a055b41bb95664fc3cb7a719e');
        SpotifyProvider.setRedirectUri('http://localhost/callback');
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
                    mediaStorage.setItem("idUser",data.id);
                    $.ajax({
                        type:"GET",
                        url: "db/insertLogin.php",
                        data: "idUser=" + data.id + "&nameUser=" + data.display_name + "&imgUser=" + data.images[0].url,
                        success: function(result){
                            mediaStorage.setItem("typeUser",result);
                            //do stuff after the AJAX calls successfully completes
                        },
                    });
                    mediaStorage.setItem("nameUser",data.display_name);
                    mediaStorage.setItem("imgUser",data.images[0].url);
                    mediaStorage.setItem("idUser",data.id);

                });
                $("#feedLi").empty();
                $.getJSON("http://wave.web.ua.pt/www/db/feed.php?idUser="+mediaStorage.getItem("idUser"),function(result){
                    $.each(result, function(i, field){
                        if (field.idUSERS==mediaStorage.getItem("idUser")){
                            $("#feedLi").append("<li class='swipeout'>"+
                                "<div class='swipeout-content'>"+
                                "<div class='item-media'>"+
                                "<a href='#'><img src='"+field.foto+"' style=' border-radius: 250px; width: 50%; position: relative' class='lazy'></a> "+
                                "</div>"+
                                "<div class='item-inner'>"+
                                "<div class='item-text'>"+field.nameUser+"</div>"+
                                "<div class='item-text' style='position: absolute; left:0%; bottom: -25%'>"+field.datePosts+"</div>"+
                                "<div class='item-title-row'>"+
                                "<div class='item-title'>"+field.nameMusics+"</div>"+
                                "<div class='item-subtitle'>"+field.artist+"</div>"+
                                "</div>"+
                                '<a id="deleteBtnFeed" href="#' + field.idPOSTS + '"><i class="icon fa fa-remove"> </i></a>' +
                                '<a id="playBtnFeed" style="position:absolute;top:-200%;" href="#' + field.ref + '"><i class="icon fa fa-play fa-2x"> </i></a>' +
                                '<a id="commentFeed" href="#' + field.idPOSTS + '"><i class="icon fa fa-comment fa-2x"> </i></a>' +
                                "</div>"+
                                "</div>"+
                                "</li>");
                        }
                        else if (mediaStorage.getItem("typeUser")==2){
                            $("#feedLi").append("<li class='swipeout'>" +
                                "<div class='swipeout-content'>" +
                                "<div class='item-media'>" +
                                "<a href='#" + field.idUSERS + "' class='feedProfileLink'><img src='" + field.foto + "' style=' border-radius: 250px; width: 50%; position: relative' class='lazy'></a>" +
                                "</div>" +
                                "<div class='item-inner'>" +
                                "<a href='#" + field.idUSERS + "' class='feedProfileLink'><div class='item-text'>" + field.nameUser + "</div></a>" +
                                "<div class='item-text' style='position: absolute; left:0%; bottom: -25%'>" + field.datePosts + "</div>" +
                                "<div class='item-title-row'>"+
                                "<div class='item-title'>"+field.nameMusics+"</div>"+
                                "<div class='item-subtitle'>"+field.artist+"</div>"+
                                "</div>"+
                                '<a id="deleteBtnFeed" href="#' + field.idPOSTS + '"><i class="icon fa fa-remove"> </i></a>' +
                                "<div>"+
                                '<a id="playBtnFeed" style="position:absolute;top:-200%" href="#' + field.ref + '"><i class="icon fa fa-play fa-2x"> </i></a>' +
                                '<a id="shareBtnFeed" href="#' + field.ref + '"><i class="icon fa fa-share fa-2x"> </i></a>' +
                                '<a id="commentFeed" href="#' + field.idPOSTS + '"><i class="icon fa fa-comment fa-2x"> </i></a>' +
                                "</div>" +
                                "</div>" +
                                "</li>");
                        }
                        else {
                            $("#feedLi").append("<li class='swipeout'>" +
                                "<div class='swipeout-content'>" +
                                "<div class='item-media'>" +
                                "<a href='#" + field.idUSERS + "' class='feedProfileLink'><img src='" + field.foto + "' style=' border-radius: 250px; width: 50%; position: relative' class='lazy'></a>" +
                                "</div>" +
                                "<div class='item-inner'>" +
                                "<a href='#" + field.idUSERS + "' class='feedProfileLink'><div class='item-text'>" + field.nameUser + "</div></a>" +
                                "<div class='item-text' style='position: absolute; left:0%; bottom: -25%'>" + field.datePosts + "</div>" +
                                "<div class='item-title-row'>"+
                                "<div class='item-title'>"+field.nameMusics+"</div>"+
                                "<div class='item-subtitle'>"+field.artist+"</div>"+
                                "</div>"+
                                "<div>"+
                                '<a id="playBtnFeed" style="position:absolute;top:-200%" href="#' + field.ref + '"><i class="icon fa fa-play fa-2x"> </i></a>' +
                                '<a id="shareBtnFeed" href="#' + field.ref + '"><i class="icon fa fa-share fa-2x"> </i></a>' +
                                '<a id="commentFeed" href="#' + field.idPOSTS + '"><i class="icon fa fa-comment fa-2x"> </i></a>' +
                                "</div>" +
                                "</div>" +
                                "</li>");
                        }
                    });
                });
                mainView.router.load({pageName: 'feed'});

            }, function () {
                alert ("Login Failed");
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
