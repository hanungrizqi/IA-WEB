$(document).ready(function () {
    loadSliderImages();
});

function submitImage() {
    debugger
    var form = document.getElementById('sliderForm');
    var formData = new FormData(form);

    $.ajax({
        url: $("#web_link").val() + "/api/Master/InsertImage", // URI
        data: formData,
        dataType: "json",
        type: "POST",
        /*contentType: "application/json; charset=utf-8",*/
        processData: false,
        contentType: false,
        success: function (data) {
            if (data.Remarks == true) {
                Swal.fire({
                    title: 'Saved',
                    text: "Data has been Saved.",
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "/Master/Sliders";
                    }
                });
            } else if (data.Remarks == false) {
                Swal.fire({
                    title: 'Warning',
                    text: "One or More photo already exist.",
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
            } else {
                Swal.fire(
                    'Error!',
                    'Message: ' + data.Message,
                    'error'
                );
            }
        },
        error: function (xhr) {
            alert(xhr.responseText);
        }
    });
}

function loadSliderImages() {
    $.ajax({
        url: $("#web_link").val() + "/api/Master/GetSliderImages", // URI
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data.Remarks == true) {
                /*debugger*/
                console.log(data.sliderImages);
                var galleryContainer = $(".js-gallery");

                // Hapus semua gambar yang sudah ada sebelumnya
                /*galleryContainer.empty();*/

                // Tambahkan gambar-gambar baru ke dalam galeri
                for (var i = 0; i < data.sliderImages.length; i++) {
                    /*debugger*/
                    var imageUrl = data.sliderImages[i];
                    var imageHtml = `
                        <div class="col-md-6 col-lg-4 col-xl-3 animated fadeIn">
                            <div class="options-container fx-item-zoom-in fx-overlay-slide-down">
                                <img class="img-fluid options-item" src="${imageUrl}" alt="">
                                <div class="options-overlay bg-black-75">
                                    <div class="options-overlay-content">
                                        <h3 class="h4 text-white mb-1">Image</h3>
                                        <h4 class="h6 fw-normal text-white-75 mb-3">More Details</h4>
                                        <a class="btn btn-sm btn-alt-danger" onclick="deleteImages('${imageUrl}')" data-image-url="${imageUrl}">
                                            <i class="fa fa-times opacity-50 me-1"></i> Delete
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    galleryContainer.append(imageHtml);
                }
            }
        },
        error: function (xhr) {
            console.error(xhr.responseText);
        }
    });
}

function deleteImages(imageUrl) {
    debugger
    console.log($("#web_link").val());
    console.log(imageUrl);

    $.ajax({
        type: "POST",
        url: $("#web_link").val() + "/api/Master/DeleteImage", // URI
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(imageUrl),
        success: function (data) {
            if (data.Remarks == true) {
                Swal.fire({
                    title: 'Saved',
                    text: "Data has been Deleted.",
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "/Master/Sliders";
                    }
                });
            } else {
                Swal.fire(
                    'Error!',
                    'Message: ' + data.Message,
                    'error'
                );
            }
        },
        error: function (xhr) {
            alert(xhr.responseText);
        }
    });
}