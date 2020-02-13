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
        
          // Checks for notes in article
      if (data.note) {
        // Fills the title to input 
        $("#titleinput").val(data.note.title);
        // Fills the boddy to textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

