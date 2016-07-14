//Transform JSON into string
Template7.registerHelper('stringify', function (context){
    var str = JSON.stringify(context);
    return str.replace(/'/g, '&#39;');
});

//Check if player has source (localStorage)
var mediaStorage = window.localStorage;
var playerHtml = document.getElementById("player");
var spotifyLink = document.getElementById("spotifyLink");
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
    var map;
    document.addEventListener("deviceready", function() {
        var div = document.getElementById("map-canvas");

        // Initialize the map view
        map = plugin.google.maps.Map.getMap(div);
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
    function playerUpdate(playlist,feed){
        mediaStorage.setItem("playerUrl",item.preview_url);
        mediaStorage.setItem("playerTrack",item.name);
        mediaStorage.setItem("playerArtist",item.artists[0].name);
        mediaStorage.setItem("playerExt",item.external_urls.spotify);
        mediaStorage.setItem("playerImg",item.album.images[2].url);
        mediaStorage.setItem("playerImgBig",item.album.images[0].url);
        mediaStorage.setItem("playerID",item.id);
        mediaStorage.setItem("playerAlbum",item.album.name);
    }
    //Updates the player info (only called on "play" inside a search)
    function playerChange (){
        playerHtml.pause();
        playerHtml.setAttribute("src",mediaStorage.getItem("playerUrl"));
        spotifyLink.setAttribute("href",mediaStorage.getItem("playerExt"));

        playerHtml.play();
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
        playerChange();
    });
});


// Side Menu Handlers
$$(document).on('click', '#about', function (e) {
    myApp.alert('Show About');
});
$$(document).on('click', '#mapMenu', function(e){
    mainView.router.load({pageName: 'map'});
});
$$(document).on('click', '#feedMenu', function(e){
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


});
$$(document).on('click', '#indexMenu', function(e){
    mainView.router.load({pageName: 'index'});
});
$$(document).on('click', '#searchIcon', function(e){
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
    $(document).ready(function() {
        $("#playlistProfile,#followers,#following").empty();
        $.getJSON("http://wave.web.ua.pt/www/db/json.php?user="+mediaStorage.getItem("idUser"),function(result){
                $("#playlistProfile").append('' +
                    ' <ul style="list-style: none">' +
                    '<li class="accordion-item"><a href="#" class="item-content item-link">' +
                    '<div class="item-inner">' +
                    '<div class="item-title">Shared songs</div>' +
                    '</div></a>' +
                    '<div class="accordion-item-content" id="sharedPlay">');
            $.each(result, function(i, field){
                $("#sharedPlay").append('' +
                '<div class="content-block">' +
                    '<p>'+field.artist+' - '+field.nameMusics+'<a id="playBtnFeed" href="#'+field.ref+'"><i class="icon fa fa-play fa-2x"> </i></a> </p>' +
                    '</div>')
            });
            $("#playlistProfile").append('<a href=""><i class="icon fa fa-play fa-2x"> </i></a> ' +
                    '</div>' +
                    '</li>' +
                    '</ul>');
        });
        $.getJSON("http://wave.web.ua.pt/www/db/json.php?subsFol="+mediaStorage.getItem("idUser"),function(result) {
            var followers = Object.keys(result).length;
            $("#followers").append('Followers ('+followers+')');
        });
        $.getJSON("http://wave.web.ua.pt/www/db/json.php?subs="+mediaStorage.getItem("idUser"),function(result) {
            var followers = Object.keys(result).length;
            $("#following").append('Following ('+followers+')');
        });
        });
    mainView.router.load({pageName: 'profile'});

});
$$(document).on('click', '#shareMediaBtn', function(e) {
    var href = $(this).attr('href');
    href = href.substring(1);
    $.getJSON("https://api.spotify.com/v1/tracks/" + href, function (result) {
        var url=result.preview_url;
        var track=result.name;
        var artist=result.artists[0].name;
        var ext=result.external_urls.spotify;
        var img=result.album.images[2].url;
        var imgBig=result.album.images[0].url;
        var id=result.id;
        var album=result.album.name;
        $.ajax({
            type: "GET",
            url: "db/insertPlaylist.php",
            data: "id=" + id + "&idUser=" + mediaStorage.getItem("idUser") +
            "&name=" + track + "&artist=" + artist +
            "&album=" + album +
            "&link=" + url,
            dataType: "json",
            success: function (data) {
                window.alert("Post successful!")
            }

        });
        mainView.router.back();
    });
});
$$(document).on('click', '.feedProfileLink', function(e){
    $("#playlistProfileO,#followersO,#followingO").empty();
    var href = $(this).attr('href');
    href=href.substring(1);
    $.getJSON("http://wave.web.ua.pt/www/db/json.php?user="+href,function(result){
        $("#playlistProfileO").append('' +
            ' <ul style="list-style: none">' +
            '<li class="accordion-item"><a href="#" class="item-content item-link">' +
            '<div class="item-inner">' +
            '<div class="item-title">Shared songs</div>' +
            '</div></a>' +
            '<div class="accordion-item-content" id="sharedPlayO">');
        $.each(result, function(i, field){
            $("#sharedPlayO").append('' +
                '<div class="content-block">' +
                '<p>'+field.artist+' - '+field.nameMusics+'<a id="playBtnFeed" href="#'+field.ref+'"><i class="icon fa fa-play fa-2x"> </i></a> </p>' +
                '</div>')
        });
        $("#playlistProfileO").append('<a href=""><i class="icon fa fa-play fa-2x"> </i></a> ' +
            '</div>' +
            '</li>' +
            '</ul>');
    });
    $.getJSON("http://wave.web.ua.pt/www/db/profile.php?user="+href,function(data) {
        $("#profileO_name").empty().append(data[0].nameUser);
        $("#profileO_country").empty().append(data[0].email);
        $("#profileO_image").attr("src",data[0].foto);
        $.getJSON("http://wave.web.ua.pt/www/db/json.php?subsFol="+mediaStorage.getItem("idUser"),function(result) {
            var followers = Object.keys(result).length;
            $("#followingO").append('Following ('+followers+')');
        });
        $.getJSON("http://wave.web.ua.pt/www/db/json.php?subs="+mediaStorage.getItem("idUser"),function(result) {
            var followers = Object.keys(result).length;
            $("#followersO").append('Followers ('+followers+')');
        });
        $.getJSON("http://wave.web.ua.pt/www/db/profile.php?userF="+mediaStorage.getItem("idUser")+"&user="+href,function(data) {
            if (data.result=="empty"){
                $("#profileO_follow").css("display","");
                $("#profileO_unfollow").css("display","none");
                $$(document).on('click', '#profileO_follow', function(e) {
                    $.ajax({
                        type:"GET",
                        url: "db/insertSub.php",
                        data: "id=" + href + "&idUser=" + mediaStorage.getItem("idUser"),
                        dataType: "json",
                        success: function(data){
                        }
                    });
                    alert("follow");
                    mainView.router.back();
                });

            }
            else {
                $("#profileO_follow").css("display","none");
                $("#profileO_unfollow").css("display","");
                $$(document).on('click', '#profileO_unfollow', function(e) {
                    $.ajax({
                        type:"GET",
                        url: "db/deleteSub.php",
                        data: "id=" + href + "&idUser=" + mediaStorage.getItem("idUser"),
                        dataType: "json",
                        success: function(data){
                        }
                    });
                    alert("unfollow");
                    mainView.router.back();
                });
            }
        });
    });
        mainView.router.load({pageName: 'profileOther'});
});
//ON PLAYER BUTTONS
$$(document).on('click', '#playBtnFeed', function(e){
    var href = $(this).attr('href');
    href = href.replace('#','');
    $.getJSON("https://api.spotify.com/v1/tracks/" + href, function (result) {
        mediaStorage.setItem("playerUrl",result.preview_url);
        mediaStorage.setItem("playerTrack",result.name);
        mediaStorage.setItem("playerArtist",result.artists[0].name);
        mediaStorage.setItem("playerExt",result.external_urls.spotify);
        mediaStorage.setItem("playerImg",result.album.images[2].url);
        mediaStorage.setItem("playerImgBig",result.album.images[0].url);
        mediaStorage.setItem("playerID",result.id);
        mediaStorage.setItem("playerAlbum",result.album.name);
        playerHtml.pause();
        playerHtml.setAttribute("src",mediaStorage.getItem("playerUrl"));
        spotifyLink.setAttribute("href",mediaStorage.getItem("playerExt"));
        playerHtml.play();
    });
});
$$(document).on('click', '#deleteBtnFeed', function(e){
    var href = $(this).attr('href');
    href = href.replace('#','');
    if (confirm("Remove Post?")){
        $.ajax({
            type:"GET",
            url: "db/deletePost.php",
            data: "id=" + href + "&idUser=" + mediaStorage.getItem("idUser"),
            dataType: "json",
            success: function(data){
            }
        });
        mainView.router.load({pageName: 'feed'});
    }
});
$$(document).on('click', '#deleteBtnComment', function(e){
    var href = $(this).attr('href');
    href = href.replace('#','');
    if (confirm("Remove Comment?")){
        $.ajax({
            type:"GET",
            url: "db/deleteComment.php",
            data: "id=" + href + "&idUser=" + mediaStorage.getItem("idUser"),
            dataType: "json",
            success: function(data){
                alert("Successfully Deleted!")
            }
        });
        mainView.router.back();
    }
});
$$(document).on('click', '#commentFeed', function(e){
    var href = $(this).attr('href');
    href = href.replace('#','');
    mediaStorage.setItem("idPost",href);
    $.ajax({
            type:"GET",
            url: "db/comment.php",
            data: "id=" + href,
            dataType: "json",
            success: function(result){
                $("#feedLiComments").empty();
                $.each(result, function(i, field) {
                    if (field.idUSERS == mediaStorage.getItem("idUser")||mediaStorage.getItem("typeUser")==2) {
                        $("#feedLiComments").append("<li>" +
                            "<div class='item-media'>" +
                            "<a href='#'><img src='" + field.foto + "' style=' border-radius: 250px; width: 50%; position: relative' class='lazy'></a> " +
                            "</div>" +
                            "<div class='item-inner'>" +
                            "<div class='item-text'>" + field.nameUser + "</div>" +
                            "<div class='item-text' style='position: absolute; left:0%; bottom: -25%'>" + field.dateReport + "</div>" +
                            "<div class='item-title-row'>" +
                            "<div class='item-title'>" + field.description + "</div>" +
                            "</div>"+
                            '<a id="deleteBtnComment" href="#' + field.idREPORT + '"><i class="icon fa fa-remove"> </i></a>' +
                            "</div>" +
                            "</div>" +
                            "</li>");
                    }
                    else {
                        $("#feedLiComments").append("<li>" +
                            "<div class='item-media'>" +
                            "<a href='#'><img src='" + field.foto + "' style=' border-radius: 250px; width: 50%; position: relative' class='lazy'></a> " +
                            "</div>" +
                            "<div class='item-inner'>" +
                            "<div class='item-text'>" + field.nameUser + "</div>" +
                            "<div class='item-text' style='position: absolute; left:0%; bottom: -25%'>" + field.dateReport + "</div>" +
                            "<div class='item-title-row'>" +
                            "<div class='item-title'>" + field.description + "</div>" +
                            "</div>" +
                            "</div>" +
                            "</li>");
                    }
                });
                $("#feedLiComments").append("<li>"+
                    "<div class='item-media'>"+
                    "<div class='item-input'>" +
                    "<textarea id='commentContent' style='background-color:rgba(0, 0, 0, 0.1);width: 80%;float: left;'></textarea>" +
                    "<div class='item-title'>"+
                    '<a id="commentInsertFeed" href="#" style="margin-left:20%;margin-top:50%"><i class="icon fa fa-comment fa-2x"> </i></a>'+
                    "</div>"+
                    "</div>"+
                    "</li>");

            },
        error: function(error){
            $("#feedLiComments").empty().append("No comments to display");
            $("#feedLiComments").append("<li>"+
                "<div class='item-media'>"+
                "<div class='item-input'>" +
                "<textarea id='commentContent' style='background-color:rgba(0, 0, 0, 0.1);width: 80%;float: left;'></textarea>" +
                "<div class='item-title'>"+
                '<a id="commentInsertFeed" href="#" style="margin-left:20%;margin-top:50%"><i class="icon fa fa-comment fa-2x"> </i></a>'+
                "</div>"+
                "</div>"+
                "</li>");
        }
    });
    mainView.router.load({pageName: 'comments'});
});
$$(document).on('click', '#commentInsertFeed', function(e){
    var error;
    var content = $("#commentContent").val();
    $.ajax({
        type: "GET",
        url: "db/insertComment.php",
        data: "id=" + mediaStorage.getItem("idPost") + "&idUser=" + mediaStorage.getItem("idUser") +
        "&comment=" + content,
        dataType: "json",
        success: function (data) {
            alert("Comment successful!")
        }
    });
        alert("Comment successful!");
    mainView.router.back();
});
$$(document).on('click', '#btn-expand', function(e){
        $("#expandContent").css("background-image", "url("+mediaStorage.getItem('playerImgBig')+")");
        mainView.router.load({pageName: 'expandPlayer'});

});
$$(document).on('click', '#shareBtnFeed', function(e){
    if (confirm("Share now?")) {
        var href = $(this).attr('href');
        href = href.replace('#','');
        var url;
        var track;
        var artist;
        var ext;
        var img;
        var imgBig;
        var id;
        var album;
        $.getJSON("https://api.spotify.com/v1/tracks/" + href, function (result) {
            url=result.preview_url;
            track=result.name;
            artist=result.artists[0].name;
            ext=result.external_urls.spotify;
            img=result.album.images[2].url;
            imgBig=result.album.images[0].url;
            id=result.id;
            album=result.album.name;
            $.ajax({
                type: "GET",
                url: "db/insertPlaylist.php",
                data: "id=" + id + "&idUser=" + mediaStorage.getItem("idUser") +
                "&name=" + track + "&artist=" + artist +
                "&album=" + album +
                "&link=" + url,
                dataType: "json",
                success: function (data) {
                    window.alert("Post successful!")
                }

            });
            mainView.router.load({pageName: 'feed'});
        });

    }
});
$$(document).on('click', '#btn-ShareExp', function(e){
    if (confirm("Share now?")) {
        $.ajax({
            type: "GET",
            url: "db/insertPlaylist.php",
            data: "id=" + mediaStorage.getItem("playerID") + "&idUser=" + mediaStorage.getItem("idUser") +
            "&name=" + mediaStorage.getItem("playerTrack") + "&artist=" + mediaStorage.getItem("playerArtist") +
            "&album=" + mediaStorage.getItem("playerAlbum") +
            "&link=" + mediaStorage.getItem("playerUrl"),
            dataType: "json",
            success: function (data) {
                window.alert("Post successful!")
            }

        });
    }
});
//PLAYER ACTION SHEET
$$('.ac-1').on('click', function () {
    var buttons = [
        {
            text: 'Post Now',
            bold: true,
            onClick: function (){
                $.ajax({
                    type:"GET",
                    url: "db/insertPlaylist.php",
                    data: "id=" + mediaStorage.getItem("playerID") + "&idUser=" + mediaStorage.getItem("idUser") +
                    "&name=" + mediaStorage.getItem("playerTrack")+ "&artist=" + mediaStorage.getItem("playerArtist")+
                    "&album=" + mediaStorage.getItem("playerAlbum")+
                    "&link=" + mediaStorage.getItem("playerUrl"),
                    dataType: "json",
                    success: function(data){
                        window.alert("Post successful!")
                    }

                });
            }
        },
        {
            text: 'Cancel',
            color: 'red'
        }
    ];
    myApp.actions(buttons);
});
//ON PAGE LOADINGS:

// DATABASE
// MEDIA PLAYLISTS
myApp.onPageInit ('media', function (page) {
    $(document).ready(function() {
        $.getJSON("http://wave.web.ua.pt/www/db/json.php?user="+mediaStorage.getItem("idUser"),function(result){
            $.each(result, function(i, field){
            });
        });
    });
});

// MAP AND GEOLOCATION




//OPEN WINDOWS IN POPUP (GOOD FOR DATABASE STUFF)
function popupform(myform, windowname)
{
    if (! window.focus)return true;
    window.open('', windowname, 'height=200,width=400,scrollbars=no');
    myform.target=windowname;
    return true;
}

// Player
$(function() {

    var audio = $("#player")[0];
    var progressBar = $("#progress-bar");

    $('#btn-play-pause, #btn-play-pauseExp, #playerBtn').on('click', function() {
        //Play/pause the track
        if (audio.paused == false) {
            audio.pause();
            $(this).children('i').removeClass('fa-pause');
            $(this).children('i').addClass('fa-play');
            $('#btn-play-pauseExp,#playerBtn').children('i').removeClass('fa-pause');
            $('#btn-play-pauseExp,#playerBtn').children('i').addClass('fa-play');
        } else {
            audio.play();
            $(this).children('i').removeClass('fa-play');
            $(this).children('i').addClass('fa-pause');
            $('#btn-play-pauseExp,#playerBtn').children('i').removeClass('fa-play');
            $('#btn-play-pauseExp,#playerBtn').children('i').addClass('fa-pause');
        }
    });


    $('#btn-stop,#btn-stopExp,#playerBtn').on('click', function() {
        //Stop the track
        audio.pause();
        audio.currentTime = 0;
        $('#btn-play-pause,#btn-play-pauseExp,#playerBtn').children('i').removeClass('fa-pause');
        $('#btn-play-pause,#btn-play-pauseExp,#playerBtn').children('i').addClass('fa-play');
    });

    $('#btn-mute,#btn-muteExp').on('click', function() {
        //Mutes/unmutes the sound
        if(audio.volume != 0) {
            audio.volume = 0;
            $(this).children('i').removeClass('fa-volume-up');
            $('#btn-muteExp').children('i').removeClass('fa-volume-up');
            $(this).children('i').addClass('fa-volume-off');
            $('#btn-muteExp').children('i').addClass('fa-volume-off');
        } else {
            audio.volume = 1;
            $(this).children('i').removeClass('fa-volume-off');
            $('#btn-muteExp').children('i').removeClass('fa-volume-off');
            $(this).children('i').addClass('fa-volume-up');
            $('#btn-muteExp').children('i').addClass('fa-volume-up');
        }
    });
    $('#btn-backwardExp').on('click', function() {

    });
        //Progress Bar event listener
    $('#player').on('timeupdate', function() {
        $('#progress-bar').attr("value", this.currentTime / this.duration);
    });
});


