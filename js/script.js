
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    city = $("#city").val()
    var svAdress = $("#street").val() + ', ' + city;
    $greeting.text('So, you want to live at ' + svAdress + '?');
    var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=1600x1200&location=' + svAdress + '';
    $body.append("<img class = 'bgimg' src = '" + streetviewUrl + "'>");

    // load NYT articles

    var NYurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + city + "&sort=newest&api-key=e5879d59e6614412a48e5616b09b01a2";
    $.getJSON(NYurl, function(data){console.log(data)});
    $.getJSON(NYurl, function(data){
        $nytHeaderElem.text("NY Times Article about " + city + ':');
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++ ){
            var article = articles[i];
            $nytElem.append("<li class = 'article'>" + "<a href = '" + article.web_url + "'>" + article.headline.main + "</a>" + 
                "<p>" + article.snippet + "</p>" + "</li>")
        }
    }).error(function() { 
       $nytHeaderElem.text( "NY Times Article about " + city + '  could not be found!');
    })

    // load Wikipedia articles

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text('wikipedia articles could not be found')
    }, 8000);

    var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search="
                     + city + "&format=json&callback=wikiCallback";
    $.ajax({url : wikiURL, dataType : "jsonp", success : function(response){
                                                                            var wArticles = response[1];
                                                                            for (var i = 0; i < wArticles.length; i++){
                                                                                var wArticle = wArticles[i];
                                                                                var wUrl = "http://en.wikipedia.org/wiki/" + wArticle;
                                                                                $wikiElem.append("<li class = 'wikiArticle'>" + "<a href = '" + wUrl + "'>"+ wArticle + "</a>" + "</li>")};
            clearTimeout(wikiRequestTimeout);}
    });
    return false;

};


$('#form-container').submit(loadData);
