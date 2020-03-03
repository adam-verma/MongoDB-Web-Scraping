$('ul li').on('click', function() {
$('ul li').removeClass('active');  
$('ul li').addClass('active'); 
});

// Get articles from route in JSON format 
$.getJSON("/articles", function(res) {
    console.log(res);
    // Loop through the data array
    for (let i=0; i< res.length; i++) {
        // Display information on the page
        $('.article-body').append(`<p data-id= "${res._id}"> ${res[i].name} <br/> ${res[i].address} <br/> ${res[i].phone} <br/> ${res[i].fees} <br/> ${res[i].hours} <br/> ${res[i].climate} </p>`);
    }
});

$('#scrapeTab').on('click', function() {
    $('#articles').empty(); 
    $.ajax({method: "GET", url: "/scrape",}).then(function(results) {
        location.reload();
    })
    .catch(function(error) {
        console.log(error)
    });
});

$('#noteBtn').on("click", function() {

// Event listener for appended <p> tags in article
$(document).on("click", "p", function() { 
    // Clear out the notes from note section to avoid repeated ones
    $('#notes').empty(); 
    // Grab the id from <p> tag
    const articleId = $(this).attr("data-id");

    // Make AJAX call for Article 
    $.ajax({
        method: "GET",
        url: "/articles/" + articleId
    })

    // Addd note information upon receiving from AJAX call
    .then(function(data) {
        console.log(data);
        $("#notes").append(`<h2> ${data.name} </h2>`);
         // An input to enter a new title
        $("#notes").append(`<input id='titleinput' name='title'>`);
        // A textarea to add a new note body
        $("#notes").append(`<textarea id='bodyinput' name='body'>`);
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append(`<button data-id='${data._id}' id='savenote'> Save Note </button>`);
        // A button to delete a note with the id saved to it
        $("#notes").append(`<button data-id='${data._id}' id='deletenote'> Delete Note </button>`);
        
          // Checks for notes in article
      if (data.note) {
        // Fills the title to input 
        $("#titleinput").val(data.note.title);
        // Fills the boddy to textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});
});

// Upon clicking save note button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the Article;
    const articleId = $(this).attr("data-id");

    // POST request for change the note that is entered
    $.ajax({
        method: "POST",
        url: "/savedNote/" + articleId,
        data: {
            // Value from title input
            title: $('#titleinput').val(),
            // Value from note textarea
            body: $('#bodyinput').val()
            
        }
    }) 
    .then(function(response) {
        // Console the response 
        console.log(response);
        $("#notes").empty();
    });

    // Then clear the values entered in the input and textarea after saving 
    $('#titleinput').val("");
    $('#bodyinput').val("");
});

$(document).on("click", "deletenote", function() {
    const articleId = $(this).attr("data-id");
      // POST request for change the note that is entered
      $.ajax({
        method: "POST",
        url: "/deleteArticle/" + articleId,
        data: {
            // Value from title input
            title: $('#titleinput').val(),
            // Value from note textarea
            body: $('#bodyinput').val()
        }
    }) 
    .then(function(response) {
        location.reload();
    });

})



