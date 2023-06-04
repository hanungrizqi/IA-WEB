$(document).ready(function () {
    loadSliderImages();
    //$(document).ready(function () {
    //    var contentContainer = $("#contentContainer");

    //    $.ajax({
    //        url: $("#web_link").val() + "/api/Master/GetTentangIAData",
    //        type: "GET",
    //        success: function (data) {
    //            var content = "";
    //            console.log(data);
    //            for (var i = 0; i < data.length; i++) {
    //                var item = data[i];
    //                //content += '<a class="link-fx text-white" href="' + item.PATH_CONTENT + '">' + item.NAME_CONTENT + '</a><br/>';
    //                content += '<a class="link-fx text-white" href="' + item.PATH_CONTENT + '" target="_blank">' + item.NAME_CONTENT + '</a><br/>';
    //            }
    //            contentContainer.html(content);
    //        },
    //        error: function (xhr) {
    //            console.log(xhr.responseText);
    //            contentContainer.html("Failed to load data.");
    //        }
    //    });
    //});
    loadTentang();
    loadPublikasi();
});

function loadSliderImages() {
    $.ajax({
        url: $("#web_link").val() + "/api/Master/GetSliderImages", // URI
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.Remarks == true) {
                var sliderContainer = $("#sliderContainer");
                sliderContainer.empty();

                for (var i = 0; i < data.sliderImages.length; i++) {
                    var imageUrl = data.sliderImages[i];
                    var sliderItemHtml = `
                        <div class="slider-item">
                            <img class="slider-image" src="${imageUrl}" alt="">
                        </div>
                    `;
                    sliderContainer.append(sliderItemHtml);
                }

                $('.slider').slick({
                    dots: true, // Add navigation dots
                    arrows: false, // Hide navigation arrows
                    autoplay: true, // Enable autoplay
                    autoplaySpeed: 2000 // Set autoplay speed in milliseconds
                });
            }
        },
        error: function (xhr) {
            console.error(xhr.responseText);
        }
    });
}

function loadTentang() {
    var contentContainer = $("#contentContainer");

    $.ajax({
        url: $("#web_link").val() + "/api/Master/GetTentangIAData",
        type: "GET",
        success: function (data) {
            var content = "";
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                //content += '<a class="link-fx text-white" href="' + item.PATH_CONTENT + '">' + item.NAME_CONTENT + '</a><br/>';
                content += '<a class="link-fx text-white" href="' + item.PATH_CONTENT + '" target="_blank">' + item.NAME_CONTENT + '</a><br/>';
            }
            contentContainer.html(content);
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            contentContainer.html("Failed to load data.");
        }
    });
}

function loadPublikasi() {
    var publikasiLayananContainer = $("#publikasiLayananContainer");

    $.ajax({
        url: $("#web_link").val() + "/api/Master/GetPublikasiLayananData",
        type: "GET",
        success: function (data) {
            var content = "";
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                content += '<a class="link-fx text-white" href="' + item.LINK_APP + '" target="_blank">' + item.NAME_APP + '</a><br/>';
            }

            publikasiLayananContainer.html(content);
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            publikasiLayananContainer.html("Failed to load data.");
        }
    });
}