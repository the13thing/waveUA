angular
    .module('waveUA', ['spotify'])
    .config(function (SpotifyProvider) {
        SpotifyProvider.setClientId('d1fa368a055b41bb95664fc3cb7a719e');
        SpotifyProvider.setRedirectUri('http://localhost/callback.html');
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
            OAuth.initialize('d1fa368a055b41bb95664fc3cb7a719e');
            OAuth.popup('spotify',{
                cache: true
            }).done(function(result){

            }).fail(function(err){

            })

                mainView.router.load({pageName: 'index'});


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
