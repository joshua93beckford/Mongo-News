function init() {
    $.getJSON("/getsaved", function (data) {
        // For each one
        $("#articles").empty();

        for (var i = 0; i < data.length; i++) {

            // Display the apropos information on the page
            $("#articles").append("<div class='col-lg-3 col-sm-6 portfolio-item'>" +
                "<div class='card h-100'>" +
                "<a href='#'><img class='card-img-top' src='" + data[i].photo + "' alt=''></a>" +
                "<div class='card-body'>" +
                "<h4 class='card-title'>" +
                "<a href='" + data[i].link + "'>" + data[i].title + "</a>" +
                "</h4>" +
                "<a href='" + data[i].link +
                "<p data-id='" + data[i]._id + "'class='card-text'></p>" +
                "</a>" +
                "<button type='button' data-toggle='modal' data-target='#" + data[i]._id + "' data-backdrop='false' d-id='" + data[i]._id + "' d-title='" + data[i].title + "' d-link='" + data[i].link + "' d-photo='" + data[i].photo + "'class='btn btn-info note'>Article Notes</button>" +
                "<button type='button' d-id='" + data[i]._id + "' d-title='" + data[i].title + "' d-link='" + data[i].link + "' d-photo='" + data[i].photo + "'class='btn btn-danger delete'>Delete Article</button>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<div class='modal' id='" + data[i]._id + "' tabindex='-1' role='dialog'>" +
                "<div class='modal-dialog' role='document'>" +
                "<div class='modal-content'>" +
                "<div class='modal-header'>" +
                "<h5 class='modal-title'>Notes</h5>" +
                "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>" +
                "<span aria-hidden='true'>&times;</span>" +
                "</button>" +
                "</div>" +
                "<div class='modal-body text-center'>" +
                "<div id='notes'></div>" +
                "<form action='' id='usrform'>" +
                "Note Title:" +

                " <input type='text'  id='titleinput' name='usrname'><br>" +
                "Article Note:" +
                "<textarea id='bodyinput' rows='4' cols='50' name='comment' form='usrform'>" +
                "</textarea>" +
                "<br>" +
                "<input class='btn btn-light' d-id='" + data[i]._id + "'id='savenote' type='submit'>" +
                "</form>" +
                "<br>" +
                "</div>" +
                "<div class='modal-footer'>" +
                "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>"
            );
        }
    });
}
$(document).on("click", ".delete", function () {
    $.ajax({
        method: "POST",
        url: "/delete/",
        data: { id: $(this).attr("d-id") }
    }).then(function (data) {
        init();
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    event.preventDefault();
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("d-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    }).then(function (data) {
        $('#saveModal' + thisId).modal('hide');
    }).catch(function (err) {

    })

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});
init();