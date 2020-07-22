$(document).ready(function() {


     // Event listener for appended <p> tags in article
    $(".noteBtn").on("click", function(e) {
        // Clear out the notes from note section to avoid repeated ones
        $('#notes').empty(); 
        // Grab the id from <p> tag
        const articleId = $(this).attr("data-id");

        // Make AJAX call for Article 
        $.ajax({
            method: "GET",
            url: "/saved/" + articleId
        })
        // Add note information upon receiving from AJAX call
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
    
    // Upon clicking save note button
    $("#savenote").on("click", function() {
        // Grab the id associated with the Article;
        const articleId = $(this).closest('.card').attr("data-id");
    
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
    
    $("#deletenote").on("click", function() {
        const articleId = $(this).closest('.card').attr("data-id");

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

    $('#removeBtn').on('click', function() {
        const articleId = $(this).parent().attr('data-id');

        $(this).closest('.dropdown').remove();
        
        $.ajax({method: "POST", url: "/deleteArticle/"+articleId })
        .then(function(response) {
            location.reload();
        });
    })

    $('#clearBtn').on('click', function() {
        $('#articles').empty(); 

        
    }
    )
});