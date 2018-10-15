
$(document).on("click", ".delete", function () {
    $.ajax({
        method: "POST",
        url: "/delete/",
        data: { id: $(this).attr("d-id") }
    }).then(function (data) {
        window.location.reload();
    });
});

$(document).on("click", "#savenote", function () {
    event.preventDefault();
    var thisId = $(this).attr("d-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput"+thisId).val(),
            body: $("#bodyinput"+thisId).val()
        }
    }).then(function (data) {
        $('#' + thisId).modal('hide');
        window.location.reload();
    }).catch(function (err) {

    })

    $("#titleinput"+thisId).val("");
    $("#bodyinput"+thisId).val("");
});