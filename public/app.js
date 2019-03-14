// Grab the articles as a json
function getJson() {
  $.getJSON("/articles", function(data) {
      $("#savedArticles").hide();
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the information on the page
      $("#articles").append("<div class='panel panel-primary'> <div class='panel-heading'><h3 data-id='" + data[i]._id + "'>" + data[i].title + "<br />" +  "</h3></div>" + "<div class='panel-body'><p>" + data[i].summary + "</p>" + "<br>" +
      "<h5>" + "<a href='" + data[i].link + "'>" + "Article link" + '</a>' + "</h5>" +
        "<button class='view-notes' type='button' data-target='#noteModal' data-toggle='modal' data-id='" + data[i]._id + "'>" + "View Notes" + "</button>" +
        "<button class='save-article' type='submit' data-id='" + data[i]._id + "'>" + "Save Article" + "</button></div></div>"  + "<br>" + "<br>" + "<br>"
        
      );
    }
  });
}

// get my data
getJson();

// Whenever someone clicks a view-notes button
$(document).on("click", ".view-notes", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  $("#newNote").empty();
  // Save the id from the article
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the modal
    .done(function(data) {
      console.log(data);

      // Show the modal... and build the modal
      $("#noteModal").modal("show");
      // An input to enter a new title
      $("#newNote").append("<input id='title-input' name='title' >" + "<br>");
      // A textarea to add a new note body
      $("#newNote").append("<textarea id='body-input' name='body'></textarea>" + "<br>");
      // A button to submit a new note, with the id of the article saved to it
      $("#newNote").append("<button data-id='" + data._id + "' class='save-note'>Save Note</button>");

      // If there's a note in the article
      // if (data.note) { // make a place for them to go
      if (data.note.length != 0) {
      for (var i = 0; i < data.note.length; i++) {
        $("#notes").append(
          "<h3>" + data.note[i].title + "</h3>" +
          "<p>" + data.note[i].body + "</p>" +
          "<button data-id='" + data.note[i]._id + "' articleId='" + thisId + "' class='delete-note'>Delete Note</button>"
        );
      }
      }
      else {
        $("#notes").append("There are currently no notes for this article" + "<br>" + "<br>");

      }



    });
});

// When you click the save-note button
$(document).on("click", ".save-note", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#title-input").val(),
        // Value taken from note textarea
        body: $("#body-input").val()
      }
    })
    // With that done
    .done(function(data) {
      // Empty the notes section
      $("#notes").empty();
    });

  // remove the values entered in the input and textarea for note entry and hide the modal
  $("#title-input").val("");
  $("#body-input").val("");
  $("#noteModal").modal("hide");
});

//  code to close the modal
$("#closeModal").on("click", function(event) {
  $("#noteModal").modal("hide");
});



// When you click save-article
$(document).on("click", ".save-article", function() {
  // Grab the id associated with the article from the delete button
  var thisId = $(this).attr("data-id");

  // Run POST method
  $.ajax({
      method: "POST",
      url: "/saved/" + thisId,
    })
    // With that done...
    .done(function(data) { // refresh the page
    console.log("article saved: " + data);
     // location.reload();
    });

});


// When you click the delete button
$(document).on("click", ".delete-article", function() {
  // Grab the id associated with the article from the delete button
  var thisId = $(this).attr("data-id");

  // Run POST method
  $.ajax({
      method: "POST",
      url: "/deleteSaved/" + thisId,
    })
    // With that done...
    .done(function(data) { // refresh the page
 location.reload();
    });

});


// When you click the delete-note button
$(document).on("click", ".delete-note", function() {
  // Grab the id associated with this note  
  var thisId = $(this).attr("data-id");
   var articleId = $(this).attr("articleId");
console.log("inside delete-note " + thisId + " " + articleId);
  // Run DELETE method
  $.ajax({
      method: "DELETE",
      url: "/notes/deleteNote/" + thisId + " " + articleId,
    })
    .done(function(data) { // hide the modal
     $("#noteModal").modal("hide");// tell me it was a success
    console.log("delete successful: " + data);
    location.reload();
    });

});


// when you click on view saved
 $("#view-saved").on("click", function() {
  $.getJSON("/saved", function(data) {
     // hide articles and show saved
     $("#articles").hide();
      $("#savedArticles").show();
      $("#savedArticles").empty();
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the information on the page
       $("#savedArticles").append("<div class='panel panel-primary'> <div class='panel-heading'><h3 data-id='" + data[i]._id + "'>" + data[i].title + "<br />" +  "</h3></div>" + "<div class='panel-body'><p>" + data[i].summary + "</p>" + "<br>" +
      "<h5>" + "<a href='" + data[i].link + "'>" + "Article link" + '</a>' + "</h5>" +
        "<button class='view-notes' type='button' data-target='#noteModal' data-toggle='modal' data-id='" + data[i]._id + "'>" + "View Notes" + "</button>" +
        "<button class='delete-article' type='submit' data-id='" + data[i]._id + "'>" + "Delete Article" + "</button></div></div>"  + "<br>" + "<br>" + "<br>"
      );
    }
  });
 });
 
 
 // when you click on view-all
 $("#view-all").on("click", function() {
   // hide the saved ones
     $("#savedArticles").hide();
       $("#articles").show();
     // run getJson
     getJson();
 })
 
 
 
 // When you click the run-scrape button
$(document).on("click", "#run-scrape", function() {
  // empty the article container
  $("#articles").empty();
  // run a call to delete the articles
   $.ajax({
      method: "DELETE",
      url: "/articles/deleteAll" 
    }).done(function() {
      $.ajax({// then run the scrape
        method: "GET",
        url: "/scrape"
      }).done(function(data) {
       console.log(data);
        // getJson();
         // reload the page
      location.reload();
      });
    
    });

});