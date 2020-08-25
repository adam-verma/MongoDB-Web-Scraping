$(document).ready(function() { 

// Toggle nav link to active based on href
$('.navbar-nav a').each( function(e) {
    // Remove previously set active class
    $(this).removeClass('active');
    // Define the href variable for every <a>
    const href = $(this).attr('href');
    // Define the window path once link is clicked
    const path = window.location.pathname;
    // Apply an "active" class to link 
    $(this).toggleClass('active', href === path);
})

// Toggle the collapse to show or hide the card body
$(document).on('click', '[data-toggle=collapse]', function(e) {
    e.preventDefault();
    // Capture the data-parent attribute of collapsible button
    let parent_id = $(this).data('parent');

    // Obtain collapsible element's selector from parent to set default to hide  
    $(parent_id+' .card .row .article-body').collapse('hide');

    // Find the targeted element to toggle collapse
    let target = $(this).parents('.list-item').find('.article-body');
    target.collapse('toggle');
})

$(document).on('click', '#saveBtn', saveArticle);
$(document).on('click', '.showParks', getParks);
$(document).on('click', '#scrapeTab', scrapeData);
$(document).on('click', '#clearAllBtn', deleteAll);
$(document).on('click', '.name', toggleParks);

function scrapeData(e) {
    e.preventDefault();
    $('#articles').empty(); 
    console.log('scrap');
    window.location.origin;
    $.ajax({method: "GET", url: "/scrape"})
    .then(function(results) {
        location.reload();
    })
    .catch(function(error) {
        console.log(error)
    });
};

function saveArticle(e) {
    e.preventDefault();
    const articleId = $(this).attr("data-id");
    console.log(`articleId: ${articleId}`);
    const savedArticle = $(this).data(); 
    savedArticle.saved = true; 
    $(this).parents('.list-item').remove();

    $.ajax({method: "PUT", url: "/saved/"+ articleId, data: JSON.stringify(savedArticle),
    success: function () {
        console.log(`savedArticle: ${savedArticle}`);
        window.location.origin;
    },
    error: function (error) {
        console.log(error)
    }
    })
}

function getParks(e) {
    e.preventDefault();
    $.ajax({method: "GET", url: "/",}).then(function(results) {
        window.location.href = "/"
    })
    .catch(function(error) {
        console.log(error)
    });
}

function toggleParks() {
    $(this).first().removeClass('.collapsed');
    $('.article-body').first().addClass('in');
}

function deleteAll(e) {
    e.preventDefault();
    $.ajax({method: "DELETE", url: "/deleteArticles"})
    .then(function(results) {
        location.reload();
        $('#articles').empty(); 
    })
    .catch(function(error) {
        console.log(error)
    });

    return false;
};

});