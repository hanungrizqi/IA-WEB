var table = $("#table_content").DataTable({
    ajax: {
        url: $("#web_link").val() + "/api/Master/Get_Content",
        dataSrc: "Data",
    },
    "columnDefs": [
        { "className": "dt-center", "targets": [0, 1, 2, 3] },
        { "className": "dt-nowrap", "targets": '_all' }
    ],
    scrollX: true,
    columns: [
        {
            "data": null,
            render: function (data, type, row, meta) {
                return meta.row + meta.settings._iDisplayStart + 1;
            }
        },
        { data: 'NAME_CONTENT' },
        {
            data: 'PATH_CONTENT',
            render: function (data, type, row) {
                var fileName = data.split('/').pop();
                //return '<a href="' + data + '" target="_blank" style="color: green;">' + fileName + '</a>';
                return '<a href="' + data + '" target="_blank" style="color: green;">View Attachment</a>';
            }
        },
        {
            data: 'ID',
            targets: 'no-sort', orderable: false,
            render: function (data, type, row) {
                action = `<div class="btn-group">`
                action += `<button type="button" onclick="deleteContent(${row.ID})" class="btn btn-sm btn-danger" title="Delete">Delete
                                </button>`
                action += `</div>`
                return action;
            }
        }
    ]
});

function submitContent() {
    debugger
    let nameContent = $("#txt_nmContent").val();
    let attachmentFile = $("#txt_attach")[0].files[0]; // Mendapatkan file yang dipilih

    if (nameContent === '' || nameContent === null) {
        Swal.fire({
            title: 'Warning',
            text: "Please enter name content.",
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

    // Buat objek FormData dan tambahkan data yang ingin dikirim
    let formData = new FormData();
    formData.append('nameContent', nameContent);
    formData.append('attachmentFile', attachmentFile);

    $.ajax({
        //url: $("#web_link").val() + "/api/Master/Insert_Content", //URI
        url: "/Master/Insert_Content", //URI
        data: formData,
        /*dataType: "json",*/
        type: "POST",
        /*contentType: "application/json; charset=utf-8",*/
        contentType: false, // Hapus pengaturan contentType
        processData: false, // Tidak memproses data secara otomatis
        beforeSend: function () {
            $("#overlay").show();
        },
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
                        window.location.href = "/Master/TentangIAWEB";
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
            $("#overlay").hide();
        }
    })
}

function deleteContent(id) {
    debugger
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
            debugger
            $.ajax({
                //url: $("#web_link").val() + "/api/Master/Delete_Content/" + id, //URI
                url: "/Master/Delete_Content/" + id, //URI
                type: "DELETE",
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

function submitLinkContent() {
    debugger
    let obj = new Object
    obj.NAME_CONTENT = $('#txt_LinknmContent').val();
    obj.PATH_CONTENT = $('#txt_linkContent').val();

    $.ajax({
        url: $("#web_link").val() + "/api/Master/Create_Link_Content", //URI
        data: JSON.stringify(obj),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $("#overlay").show();
        },
        success: function (data) {
            if (data.Remarks == true) {
                debugger
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
                        window.location.href = "/Master/TentangIAWEB";
                    }
                });
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
            $("#overlay").hide();
        }
    })
}