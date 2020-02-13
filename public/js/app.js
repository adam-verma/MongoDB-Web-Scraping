// Get articles from route in JSON format 
$.getJSON("/articles", function(res) {
    console.log(res);
    // Loop through the data array
    for (let i=0; i< res.length; i++) {
        // Display information on the page
        $('#articles').append(`<p data-id= "${res._id}"> ${res[i].headline} <br/> ${res[i].summary} <br/> ${res[i].URL} </p>`);
    }
})

// Event listener for appended <p> tags in article
$(document).on("click", "p", function() { 
    // Clear out the notes from note section to avoid repeated ones
    $('#notes').empty(); 
    // Grab the id from <p> tag
    const articleId = $(this).attr("data-id");

    // Make AJAX call for Article 
    $.ajax({
        method: "GET",

    })
});