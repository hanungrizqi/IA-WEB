Codebase.helpersOnLoad(['jq-select2']);

$("document").ready(function () {
    $('.select2-modal').select2({
        dropdownParent: $('.modal')
    });
})

$("#txt_nrp").on("change", function () {
    $.ajax({
        url: $("#web_link").val() + "/api/Master/Get_Employee/" + this.value,
        type: "GET",
        cache: false,
        success: function (result) {
            $("#txt_district").val(result.Data.DSTRCT_CODE);
            $("#txt_email").val(result.Data.EMAIL);
        }
    });
})

var table = $("#tbl_user").DataTable({
    ajax: {
        url: $("#web_link").val() + "/api/Setting/Get_UserSetting",
        dataSrc: "Data",
    },
    "columnDefs": [
        { "className": "dt-center", "targets": [0, 2, 3, 5] }
    ],
    scrollX: true,
    columns: [
        { data: 'Username' },
        { data: 'NAME' },
        { data: 'DSTRCT_CODE' },
        { data: 'RoleName' },
        { data: 'EMAIL' },
        {
            data: 'ID.Role',
            targets: 'no-sort', orderable: false,
            render: function (data, type, row) {
                action = `<div class="btn-group">`
                action += `<button type="button" value="${row.Username}" onclick="deleteUser(${row.ID_Role}, this.value)" class="btn btn-sm btn-danger" title="Delete">Delete
                                </button>`
                action += `</div>`
                return action;
            }
        }
    ],

});


function insertUser() {
    let obj = new Object();
    obj.ID_Role = $('#txt_group').val();
    obj.Username = $('#txt_nrp').val();

    $.ajax({
        url: $("#web_link").val() + "/api/Setting/Create_User", //URI
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
                $('#modal-insert').modal('hide');
                $('.select2-modal').val('').trigger('change');
                $('.form-control').val('');

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

function deleteUser(role, nrp) {
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
                url: $("#web_link").val() + "/api/Setting/Delete_User?role=" + role + "&nrp=" + nrp, //URI
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
