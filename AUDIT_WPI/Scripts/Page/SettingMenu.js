Codebase.helpersOnLoad(['jq-select2']);

var table = $("#tbl_menu").DataTable({
    ajax: {
        url: $("#web_link").val() + "/api/Setting/Get_Menu/" + $("#txt_group").val(),
        dataSrc: "Data",
    },
    "columnDefs": [
        { "className": "dt-center", "targets": [0] }
    ],
    scrollX: true,
    columns: [
        {
            data: 'IS_ALLOW',
            targets: 'no-sort', orderable: false,
            render: function (data, type, row) {
                let idMenu = "";
                if (row.ID_Menu == 1) {
                    idMenu = "disabled"
                }
                let action = "";
                if (data == 1) {
                    action = `<input type="checkbox" class="form-control-sm" name="txt_allow" data-menu="${row.ID_Menu}" onclick="updateMenu(this)" checked ${idMenu}>`;
                } else {
                    action = `<input type="checkbox" class="form-control-sm" name="txt_allow" data-menu="${row.ID_Menu}" onclick="updateMenu(this)">`;
                }
                return action;
            }
        },
        { data: 'Name_Menu' }
    ],

});

$("#txt_group").on("change", function () {
    table.ajax.url($("#web_link").val() + "/api/Setting/Get_Menu/" + this.value).load();
})

function updateMenu(cek) {
    let obj = new Object();
    obj.ID_Menu = cek.getAttribute('data-menu');
    obj.ID_Role = $('#txt_group').val();
    if ($(cek).prop("checked") == true) {
        obj.IS_ALLOW = 1;
    }
    else if ($(cek).prop("checked") == false) {
        obj.IS_ALLOW = 0;
    }

    $.ajax({
        url: $("#web_link").val() + "/api/Setting/Update_Menu", //URI
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