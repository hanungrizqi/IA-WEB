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
            }
        },
        {
            data: 'ID',
            targets: 'no-sort', orderable: false,
            render: function (data, type, row) {
                action = `<div class="btn-group">`
                action += `<button type="button" value="${row.NAME_APP}" onclick="setPublikasi(${row.ID}, this.value, '${row.LINK_APP}')" data-bs-toggle="modal" data-bs-target="#modal_update" class="btn btn-sm btn-info" title="Edit">Edit
                                </button>`
                action += `<button type="button" onclick="deletePublikasi(${row.ID})" class="btn btn-sm btn-danger" title="Delete">Delete
                                </button>`
                action += `</div>`
                return action;
            }
        }
    ],

});

function insertApp() {
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
        if (n.value == true) {
            $.ajax({
                url: $("#web_link").val() + "/api/Master/Delete_Publikasi?id=" + id, //URI
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