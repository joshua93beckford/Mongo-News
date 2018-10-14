
$(document).on("click", ".delete", function () {
    $.ajax({
        method: "POST",
        url: "/delete/",
        data: { id: $(this).attr("d-id") }
    }).then(function (data) {
        window.location.reload();
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    event.preventDefault();
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("d-id");
    console.log(thisId);
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
        $('#' + thisId).modal('hide');
        window.location.reload();
    }).catch(function (err) {

    })

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});