var table = $("#tbl_publikasi").DataTable({
    ajax: {
        url: $("#web_link").val() + "/api/Master/Get_Publikasi",
        dataSrc: "Data",
    },
    "columnDefs": [
        { "className": "dt-center", "targets": [0, 2, 3] }
    ],
    scrollX: true,
    columns: [
        {
            "data": null,
            render: function (data, type, row, meta) {
                return meta.row + meta.settings._iDisplayStart + 1;
            }
        },
        { data: 'NAME_APP' },
        {
            data: 'LINK_APP',
            render: function (data, type, row) {
                return '<a href="' + data + '" target="_blank" style="color: green;">' + data + '</a>';
                //var fileName = data.split('/').pop();
                //return '<a href="' + data + '" target="_blank" style="color: green;">View Attachment</a>';
            }
        },
        {
            data: 'ID',
            targets: 'no-sort', orderable: false,
            render: function (data, type, row) {
                action = `<div class="btn-group">`
                //action += `<button type="button" value="${row.NAME_APP}" onclick="setPublikasi(${row.ID}, this.value, '${row.LINK_APP}')" data-bs-toggle="modal" data-bs-target="#modal_update" class="btn btn-sm btn-info" title="Edit">Edit
                //                </button>`
                action += `<button type="button" onclick="deletePublikasi(${row.ID})" class="btn btn-sm btn-danger" title="Delete">Delete
                                </button>`
                action += `</div>`
                return action;
            }
        }
    ],

});

function toggleLinkAppInput() {
    debugger
    var checkbox = document.getElementById('chk_linkApp');
    var linkAppContainer = document.getElementById('linkAppContainer');

    if (checkbox.checked) {
        linkAppContainer.innerHTML = '<input type="file" class="form-control" accept=".pdf" id="file_linkApp" name="file_linkApp">';
    } else {
        linkAppContainer.innerHTML = '<input type="text" class="form-control" id="txt_linkApp" name="txt_linkApp">';
    }
}

document.getElementById('chk_linkApp').addEventListener('change', toggleLinkAppInput);

function insertApp() {
    debugger
    var checkbox = document.getElementById('chk_linkApp');
    if (checkbox.checked) {
        debugger
        let nameContent = $("#txt_app").val();
        let attachmentFile = $("#file_linkApp")[0].files[0];

        if (nameContent === '' || nameContent === null) {
            Swal.fire({
                title: 'Warning',
                text: "Please enter name app",
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return;
        } else if (!attachmentFile) {
            Swal.fire({
                title: 'Warning',
                text: "Please upload file.",
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            return;
        }

        debugger
        let formData = new FormData();
        formData.append('nameContent', nameContent);
        formData.append('attachmentFile', attachmentFile);

        $.ajax({
            url: "/Master/Insert_Publikasi", //URI
            data: formData,
            type: "POST",
            contentType: false,
            processData: false,
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
                            window.location.href = "/Master/PublikasiLayanan";
                        }
                    });
                } else if (data.Remarks == false) {
                    Swal.fire({
                        title: 'Warning',
                        text: "File already exist.",
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
        })
    }
    else {
        debugger
        let obj = new Object
        obj.NAME_APP = $('#txt_app').val();
        obj.LINK_APP = $('#txt_linkApp').val();

        $.ajax({
            url: $("#web_link").val() + "/api/Master/Create_Publikasi", //URI
            data: JSON.stringify(obj),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.Remarks == true) {
                    Swal.fire(
                        'Saved!',
                        'Data has been Saved.',
                        'success'
                    );
                    $('#modal_insert').modal('hide');
                    $('#txt_source').val('')
                    table.ajax.reload();
                } if (data.Remarks == false) {
                    Swal.fire(
                        'Error!',
                        'Message : ' + data.Message,
                        'error'
                    );
                }

            },
            error: function (xhr) {
                alert(xhr.responseText);
            }
        })
    }
    //debugger
    //let obj = new Object
    //obj.NAME_APP = $('#txt_app').val();
    //obj.LINK_APP = $('#txt_linkApp').val();

    //$.ajax({
    //    url: $("#web_link").val() + "/api/Master/Create_Publikasi", //URI
    //    data: JSON.stringify(obj),
    //    dataType: "json",
    //    type: "POST",
    //    contentType: "application/json; charset=utf-8",
    //    success: function (data) {
    //        if (data.Remarks == true) {
    //            Swal.fire(
    //                'Saved!',
    //                'Data has been Saved.',
    //                'success'
    //            );
    //            $('#modal_insert').modal('hide');
    //            $('#txt_source').val('')
    //            table.ajax.reload();
    //        } if (data.Remarks == false) {
    //            Swal.fire(
    //                'Error!',
    //                'Message : ' + data.Message,
    //                'error'
    //            );
    //        }

    //    },
    //    error: function (xhr) {
    //        alert(xhr.responseText);
    //    }
    //})
}

function setPublikasi(id, app, link) {
    debugger
    $("#txt_id").val(id);
    $("#txt_app_update").val(app);
    $("#txt_linkApp_update").val(link);
}

function updateApp() {
    let obj = new Object
    obj.NAME_APP = $('#txt_app_update').val();
    obj.LINK_APP = $('#txt_linkApp_update').val();
    obj.ID = $('#txt_id').val();

    $.ajax({
        url: $("#web_link").val() + "/api/Master/Update_Publikasi", //URI
        data: JSON.stringify(obj),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.Remarks == true) {
                Swal.fire(
                    'Saved!',
                    'Data has been Saved.',
                    'success'
                );
                $('#modal_update').modal('hide');
                table.ajax.reload();
            } if (data.Remarks == false) {
                Swal.fire(
                    'Error!',
                    'Message : ' + data.Message,
                    'error'
                );
            }

        },
        error: function (xhr) {
            alert(xhr.responseText);
        }
    })
}

function deletePublikasi(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this data!",
        icon: "warning",
        showCancelButton: !0,
        customClass: { confirmButton: "btn btn-alt-danger m-1", cancelButton: "btn btn-alt-secondary m-1" },
        confirmButtonText: "Yes, delete it!",
        html: !1,
        preConfirm: function (e) {
            return new Promise(function (e) {
                setTimeout(function () {
                    e();
                }, 50);
            });
        },
    }).then(function (n) {
        debugger
        if (n.value == true) {
            $.ajax({
                /*url: $("#web_link").val() + "/api/Master/Delete_Publikasi?id=" + id, //URI*/
                url: "/Master/Delete_Publikasi/" + id, //URI
                type: "POST",
                success: function (data) {
                    if (data.Remarks == true) {
                        Swal.fire("Deleted!", "Your Data has been deleted.", "success");
                        table.ajax.reload();
                    } if (data.Remarks == false) {
                        Swal.fire("Cancelled", "Message : " + data.Message, "error");
                    }

                },
                error: function (xhr) {
                    alert(xhr.responseText);
                }
            })
        } else {
            Swal.fire("Cancelled", "Your Data is safe", "error");
        }
    });
}