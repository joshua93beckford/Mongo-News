var count = 0;

function init() {
  $.getJSON("/articles", function (data) {
    // For each one
    for (var i = count; i < count + 20; i++) {

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
        "<button type='button' d-id='" + data[i]._id + "' d-title='" + data[i].title + "' d-link='" + data[i].link + "' d-photo='" + data[i].photo + "'class='btn btn-info save'>Save Article</button>" +
        "</div>" +
        "</div>" +
        "</div>");
    }
  });
}

$(document).on("click", ".save", function () {
  var save = {}

  save.title = $(this).attr('d-title');
  save.link = $(this).attr('d-link');
  save.photo = $(this).attr('d-photo');

  $.ajax({
    method: "POST",
    url: "/tosave/",
    data: { save }
  }).then(function (data) {
    $('#saveModal').modal('show');
  }).catch(function (err) { });

});

$(document).on("click", ".scrape", function () {

  $("#articles").empty();

  $.ajax({
    method: "GET",
    url: "/articles/"
  }).then(function (data) {
    console.log(data);
    if (data.length == 0) {
      $.ajax({
        method: "GET",
        url: "/scrape/"
      })
    }

    init();
    $('#articleModal').modal('show');
    count += 20;
    console.log(count);
    if (count > data.length) {
      count = 0;
      $.ajax({
        method: "GET",
        url: "/scrape/"
      }).then(function (data) {
        $('#refreshModal').modal('show');
      });
    }
  });
});
init();