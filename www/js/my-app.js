Template7.registerHelper('stringify', function (context){
    var str = JSON.stringify(context);
    return str.replace(/'/g, '&#39;');
});

//Check if player has source (localStorage)
	var mediaStorage = window.localStorage;
	var playerHtml = document.getElementById("player");
	var spotifyLink = document.getElementById("spotifyLink");

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
    modalTitle: "Spotify Browser"
});

// Export selectors engine (jQuery like)
var $$ = Dom7;

// Add views - this app uses only one view stack
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
        var mediaType = "track";
        var numResults = $$("#numResults").val();

        var url = "https://api.spotify.com/v1/search?q=" + term +"&type=" + mediaType + "&limit=" + numResults;

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
});

// Media List Page Handling
myApp.onPageInit('list', function (page) {
    $$(page.container).find('.favorite').on('click', function (e) {
        // this.dataset.item returns current index of item clicked so we can retrieve from context
        var item = page.context[this.dataset.item];
        myApp.alert(item.name + ' added to favorites!');
    });

    $$(page.container).find('.preview').on('click', function (e) {
        var item = page.context[this.dataset.item];

        myApp.alert("Previewing " + item.name);
        var media = new Media(item.preview_url, function () {console.log("Media Success");},function (error)
        {console.log("Media fail " + error)},null);
        media.play();
        setTimeout(function() {media.stop()},7000); //preview for 7 seconds
    });

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

$$(document).on('click', '#settings', function (e) {
    myApp.alert('Show Settings');
});

//Updates the player info (only called on "play" inside a search)
function playerChange (){
	playerHtml.pause();
	playerHtml.setAttribute("src",mediaStorage.getItem("playerUrl"));
	playerHtml.play();
	spotifyLink.setAttribute("href",mediaStorage.getItem("playerExt"));


}
