
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
                //content += '<a class="link-fx text-white" href="' + item.PATH_CONTENT + '" target="_blank">' + item.NAME_CONTENT + '</a><br/>';
                content += '<a class="link-fx text-white" href="javascript:void(0)" onclick="showPDFPopup(\'' + item.PATH_CONTENT + '\')">' + item.NAME_CONTENT + '</a><br/>';
                //content += '<a class="link-fx text-white" href="/Master/GetTentangIAData?id=' + item.PATH_CONTENT + '">' + item.PATH_CONTENT + '</a>';
            }
            contentContainer.html(content);
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            contentContainer.html("Failed to load data.");
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
//                //content += '<a class="link-fx text-white" href="' + item.PATH_CONTENT + '" target="_blank" download>' + item.NAME_CONTENT + '</a><br/>';
//                content +=
//                    '<a class="link-fx text-white" href="' +
//                    item.PATH_CONTENT +
//                    '" target="_blank">' +
//                    item.NAME_CONTENT +
//                    "</a><br/>";

//                // Add PDF viewer for PDF content
//                content +=
//                    '<div id="adobe-dc-view-' +
//                    i +
//                    '"></div><script>(function(){var urlToPDF="' +
//                    item.PATH_CONTENT +
//                    '";var viewerOptions={embedMode:"FULL_WINDOW",defaultViewMode:"FIT_WIDTH",showDownloadPDF:false,showPrintPDF:false,showLeftHandPanel:true,showAnnotationTools:false};document.addEventListener("adobe_dc_view_sdk.ready",function(){fetch(urlToPDF).then(function(e){return e.blob()}).then(function(e){var t=new AdobeDC.View({clientId:"664497ea18234f0592a12ec3255b9882",divId:"adobe-dc-view-' +
//                    i +
//                    '"});t.previewFile({content:{promise:Promise.resolve(e.arrayBuffer())},metaData:{fileName:urlToPDF.split("/").slice(-1)[0]}})},viewerOptions)});(function(){if("function"!=typeof Blob.arrayBuffer){Blob.prototype.arrayBuffer=myArrayBuffer}function myArrayBuffer(){return new Promise(function(e){var t=new FileReader;t.onload=function(){e(t.result)},t.readAsArrayBuffer(this)})}})();})();</script>';
//            }
//            contentContainer.html(content);
//        },
//        error: function (xhr) {
//            console.log(xhr.responseText);
//            contentContainer.html("Failed to load data.");
//        },
//    });
//}


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

//function showPDFPopup(urlToPDF) {
//    debugger
//    var viewerOptions = {
//        embedMode: "FULL_WINDOW",
//        defaultViewMode: "FIT_WIDTH",
//        showDownloadPDF: false,
//        showPrintPDF: false,
//        showLeftHandPanel: true,
//        showAnnotationTools: false,
//    };

//    document.addEventListener("adobe_dc_view_sdk.ready", function () {
//        var adobeDCView = new AdobeDC.View({
//            clientId: "664497ea18234f0592a12ec3255b9882",
//            divId: "adobe-dc-view",
//        });
//        adobeDCView.previewFile(
//            {
//                content: { promise: Promise.resolve(urlToPDF) }, // Pass the URL directly as the content
//                metaData: {
//                    fileName: urlToPDF.split("/").slice(-1)[0],
//                },
//            },
//            viewerOptions
//        );
//    });
//}
