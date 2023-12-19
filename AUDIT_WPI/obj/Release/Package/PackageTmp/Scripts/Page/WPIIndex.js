
$(document).ready(function () {
    loadSliderImages();
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

//function loadTentang() {
//    var contentContainer = $("#contentContainer");
//    $.ajax({
//        url: $("#web_link").val() + "/api/Master/GetTentangIAData",
//        type: "GET",
//        success: function (data) {
//            var content = "";
//            console.log(data);
//            for (var i = 0; i < data.length; i++) {
//                var item = data[i];
//                content += '<a class="link-fx text-black" href="javascript:void(0)" onclick="showPDFPopup(\'' + item.PATH_CONTENT + '\')">' + item.NAME_CONTENT + '</a><br/>';
//            }
//            contentContainer.html(content);
//        },
//        error: function (xhr) {
//            console.log(xhr.responseText);
//            contentContainer.html("Failed to load data.");
//        }
//    });
//}

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
                var link = item.PATH_CONTENT;
                var target = "";

                if (link.startsWith("http://") || link.startsWith("https://") || link.startsWith("www.")) {
                    target = 'target="_blank"';
                    content += '<a class="link-fx text-black" href="' + link + '" ' + target + '>' + item.NAME_CONTENT + '</a><br/>';
                } else {
                    content += '<a class="link-fx text-black" href="javascript:void(0)" onclick="showPDFPopup(\'' + link + '\')">' + item.NAME_CONTENT + '</a><br/>';
                }
            }
            contentContainer.html(content);
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            contentContainer.html("Gagal memuat data.");
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
                debugger
                var item = data[i];
                var link = item.LINK_APP;
                var target = "";

                if (link.startsWith("http://") || link.startsWith("https://") || link.startsWith("www.")) {
                    target = 'target="_blank"';
                    content += '<a class="link-fx text-black" href="' + link + '" ' + target + '>' + item.NAME_APP + '</a><br/>';
                } else {
                    content += '<a class="link-fx text-black" href="javascript:void(0)" onclick="showPDFPopup(\'' + link + '\')">' + item.NAME_APP + '</a><br/>';
                }
                /*content += '<a class="link-fx text-black" href="' + item.LINK_APP + '" target="_blank">' + item.NAME_APP + '</a><br/>';*/
            }

            publikasiLayananContainer.html(content);
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            publikasiLayananContainer.html("Failed to load data.");
        }
    });
}

function showPDFPopup(path) {
    Swal.fire({
        /*title: 'PDF Viewer',*/
        html: '<div id="pdfViewerContainer"></div>',
        width: '67%',
        showCancelButton: true,
        cancelButtonText: 'Close',
        didOpen: () => {
            var pdfViewerContainer = document.getElementById('pdfViewerContainer');
            var loadingTask = pdfjsLib.getDocument(path);
            loadingTask.promise.then(function (pdf) {
                var numPages = pdf.numPages;

                for (var pageNum = 1; pageNum <= numPages; pageNum++) {
                    pdf.getPage(pageNum).then(function (page) {
                        var scale = 1.5;
                        var viewport = page.getViewport({ scale: scale });
                        var canvas = document.createElement('canvas');
                        var context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        canvas.oncontextmenu = function (e) { e.preventDefault(); e.stopPropagation(); }
                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };

                        page.render(renderContext).promise.then(function () {
                            pdfViewerContainer.appendChild(canvas);
                        });
                    });
                }
            });
        }
    }).then(function (result) {
        if (!result.dismiss) {
            // Handle close event if needed
        }
    }).finally(function () {
        enableContextMenu(); // Disable context menu after the modal is closed
    });
}

function disableContextMenu() {
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
}

function enableContextMenu() {
    document.removeEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
}
