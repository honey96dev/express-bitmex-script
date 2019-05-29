// "use strict";
// Class definition

let users;

var Users = function () {

    this.init = function () {
        let self = this;
        this.table = $('#logs').DataTable({
            ajax: '/dashboard/logs/list',
            columns: [
                {
                    data: "timestamp",
                    className: "text-center",
                },
                {
                    data: "apiKeyID",
                    className: "text-center",
                },
                {
                    data: "apiKeySecret",
                    className: "text-center",
                },
                {
                    data: "message",
                    className: "text-center",
                },
            ],
            order: [],
            language: {
                search: "",
                sLengthMenu: "_MENU_",
            },
        });


        // $('#users tbody').on('click', 'tr td.details-control', function () {
        //     var tr = $(this).closest('tr');
        //     var row = self.table.row(tr);
        //
        //     if (row.child.isShown()) {
        //         // This row is already open - close it
        //         row.child.hide();
        //         tr.find(">:first-child").html('<i class="fa fa-caret-right"></i>');
        //     } else {
        //         // Open this row
        //         row.child(self.formatRowDetail(row.data())).show();
        //         tr.find(">:first-child").html('<i class="fa fa-caret-down"></i>');
        //     }
        // });
        //
        // $('#addBitmexAccount').click(function (e) {
        //     $('#bitmexAccountDetailsForm').find('.alert').remove();
        //     $('#bitmexAccountDetailsForm').data('method', 'post');
        //     $('#email').val('');
        //     $('#name').val('');
        //     $('#testnet').val('');
        //     $('#apiKeyID').val('');
        //     $('#apiKeySecret').val('');
        //     $('#isParent').val('');
        // })
        //
        // $('#saveBitMEXAccount').click(function (e) {
        //     e.preventDefault();
        //     var btn = $(this);
        //     var form = $('#bitmexAccountDetailsForm');
        //     console.log(form.data('method'));
        //
        //     form.validate({
        //         rules: {
        //             email: {
        //                 required: true,
        //                 email: true,
        //             },
        //             name: {
        //                 required: true,
        //             },
        //             apiKeyID: {
        //                 required: true,
        //             },
        //             apiKeySecret: {
        //                 required: true,
        //             },
        //         },
        //         // messages: {
        //         //     email: "Por favor introduzca su correo electrónico",
        //         //     // email: "Please enter your Email",
        //         //     password: "Por favor introduzca su contraseña",
        //         //     // password: "Please enter your password",
        //         // },
        //     });
        //
        //     if (!form.valid()) {
        //         return;
        //     }
        //
        //     btn.attr('disabled', true);
        //     // btn.addClass('kt-loader kt-loader--right kt-loader--light').attr('disabled', true);
        //
        //     form.ajaxSubmit({
        //         url: form[0].action,
        //         method: form.data('method'),
        //         success: function (response, status, xhr, $form) {
        //             const result = response.result;
        //             const message = response.message;
        //             const data = response.data;
        //             btn.attr('disabled', false);
        //             if (result === 'success') {
        //                 $.ajax({
        //                     method: 'get',
        //                     url: '/users/users/list',
        //                     dataType: 'json',
        //                     success: function (data) {
        //                         self.table.clear();
        //                         self.table.rows.add(data.data);
        //                         self.table.draw();
        //                     },
        //                 })
        //                 // self.table.rows.add([{
        //                 //     id: data.insertId,
        //                 //     email: $('e#mail').val(),
        //                 //     name: $('#name').val(),
        //                 //     testnet: !!$('#testnet').val() ? 1 : 0,
        //                 //     apiKeyID: $('#apiKeyID').val(),
        //                 //     apiKeySecret: $('#apiKeySecret').val(),
        //                 //     isParent: !!$('#isParent').val() ? 1 : 0,
        //                 // }]);
        //                 self.showErrorMsg(form, 'success', message);
        //             } else if (result === 'error') {
        //                 self.showErrorMsg(form, 'danger', message);
        //             }
        //         },
        //         error: function (error) {
        //             btn.attr('disabled', false);
        //             self.showErrorMsg(form, 'danger', 'Unknown error');
        //         }
        //     });
        // });
        //
        // $('#closeModal').click(function (e) {
        //
        // })
    };
    //
    // this.editBitMEXAccount = function (idx) {
    //     let self = this;
    //     let form = $('#bitmexAccountDetailsForm');
    //
    //     let data = self.table.row(idx).data();
    //
    //     form.data('method', 'put');
    //     form.data('accountId', data.id);
    //
    //     $('#accountId').val(data.id);
    //     $('#email').val(data.email);
    //     $('#name').val(data.name);
    //     $('#testnet').val(data.testnet);
    //     $('#apiKeyID').val(data.apiKeyID);
    //     $('#apiKeySecret').val(data.apiKeySecret);
    //     $('#isParent').val(data.isParent);
    //     $('#bitmexAccountDetailsModal').modal('show');
    //     // console.log(idx);
    // };

    this.deleteBitMEXAccount = function (id) {
        let self = this;
        let form = $('#usersDetailsForm');
        form.data('method', 'delete');
        form.data('accountId', id);
        $('#accountId').val(id);
        console.log(form[0].action);

        const button = confirm('Really?');
        if (button) {
            form.ajaxSubmit({
                url: form[0].action,
                method: form.data('method'),
                success: function (response, status, xhr, $form) {
                    const result = response.result;
                    const message = response.message;
                    if (result === 'success') {
                        $.ajax({
                            method: 'get',
                            url: '/accounts/users/list',
                            dataType: 'json',
                            success: function (data) {
                                self.table.clear();
                                self.table.rows.add(data.data);
                                self.table.draw();
                            },
                        });
                    } else if (result === 'error') {
                        // showErrorMsg(form, 'danger', message);
                    }
                }
            });
        }
    };
};

jQuery(document).ready(function () {
    users = new Users();
    users.init();
});
