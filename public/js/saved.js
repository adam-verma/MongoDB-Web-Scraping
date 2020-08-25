$(document).ready(function() {

    $(document).on('click', '.noteBtn', addNote);
    $(document).on('click', '#savenote', saveNote);
    $(document).on('click', '#deletenote', deleteNote);
    $(document).on('click', '#removeBtn', removeSaved);

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
     // Event listener for appended <p> tags in article
    function addNote(e) {
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
            $.each(data, function(i) {
             // An input to enter a new title
            $("#new-note").append(`<label for='titleinput'>Title</label><br><input id='titleinput' name='title'><br>`);
            // A textarea to add a new note body
            $("#new-note").append(`<label for='titleinput'>Body</label><br><textarea id='bodyinput' name='body'></textarea><br>`);
            // A button to submit a new note, with the id of the article saved to it
            $("#new-note").append(`<button id='savenote'> Save Note </button>`);
            // A button to delete a note with the id saved to it
            $("#notes").append(`<button id='deletenote'> Delete Note </button>`);
            
              // Checks for notes in article
            if (data[i].note) {
                // Fills the title to input 
                $("#notes").val(data[i].note.title);
                // Fills the boddy to textarea
                $("#notes").val(data[i].note.body);
            } else { 
                $("#notes").append('<h2> No notes found! </h2>');
            } 
            });
        })
    };
    
    // Upon clicking save note button
    function saveNote(e) {
        // Grab the id associated with the Article;
        const articleId = $(this).parents('.card').attr('data-id');
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
        .then(function() {
            $("#notes").empty();
        });
    
        // Then clear the values entered in the input and textarea after saving 
        $('#titleinput').val("");
        $('#bodyinput').val("");
    };
    
    function deleteNote(e) {
        e.preventDefault();
        const articleId = $(this).closest('.card').attr("data-id");

          // POST request for change the note that is entered
          $.ajax({
            method: "POST",
            url: "/deletedNote/" + articleId,
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
    }

    function removeSaved(e) {
        e.preventDefault();
        const articleId = $(this).attr('data-id');
        console.log(articleId);
        $(this).parents('.list-item').remove();
        
        $.ajax({method: "PUT", url: "/deleteArticle/"+articleId}) 
        .then(function (results) {
            console.log(`deleted: ${results}`);
            window.location.origin;
        })
    }

    $('#clearBtn').on('click', function() {
        $('#articles').empty(); 
        
    }
    )
});