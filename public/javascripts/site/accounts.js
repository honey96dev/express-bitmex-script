// "use strict";
// Class definition

let accounts;

var Accounts = function () {
    this.formatNumber = function (num, precision) {
        return num.toFixed(precision).toString();
        // return num.toPrecision(precision).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    this.showErrorMsg = function (form, type, msg) {
        var alert = $('<div class="kt-alert kt-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
			<span></span>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        //alert.animateClass('fadeIn animated');
        KTUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    }

    this.init = function () {
        let self = this;
        this.table = $('#accounts').DataTable({
            ajax: '/accounts/bitmex/list',
            columns: [
                {
                    width: '3%',
                    className: 'details-control',
                    orderable: false,
                    data: null,
                    defaultContent: '<i class="fa fa-caret-right"></i>'
                },
                {
                    // width: '12%',
                    data: "email",
                    className: "text-center",
                },
                {
                    // width: '10%',
                    data: "name",
                    className: "text-center",
                },
                {
                    // width: '10%',
                    data: "isParent",
                    className: "text-center",
                    render: function (data, type, row) {
                        return !!data ? 'Yes' : 'No';
                    }
                },
                {
                    width: '5%',
                    data: "row_num",
                    render: function (data, type, row) {
                        return '<button class="btn btn-clean btn-sm btn-icon" onclick="accounts.editBitMEXAccount(' + data + ')"><i class="fa fa-edit margin-auto"></i></button>';
                    },
                    orderable: false,
                },
                {
                    width: '5%',
                    data: "id",
                    render: function (data, type, row) {
                        return '<button class="btn btn-clean btn-sm btn-icon" onclick="accounts.deleteBitMEXAccount(' + data + ')"><i class="fa fa-trash margin-auto"></i></button>';
                    },
                    orderable: false,
                }
            ],
            order: [],
            language: {
                search: "",
                sLengthMenu: "_MENU_",
            },
        });


        $('#accounts tbody').on('click', 'tr td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = self.table.row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.find(">:first-child").html('<i class="fa fa-caret-right"></i>');
            } else {
                // Open this row
                row.child(self.formatRowDetail(row.data())).show();
                tr.find(">:first-child").html('<i class="fa fa-caret-down"></i>');
            }
        });

        $('#addBitmexAccount').click(function (e) {
            $('#bitmexAccountDetailsForm').find('.alert').remove();
            $('#bitmexAccountDetailsForm').data('method', 'post');
            $('#email').val('');
            $('#name').val('');
            $('#testnet').val('');
            $('#apiKeyID').val('');
            $('#apiKeySecret').val('');
            $('#isParent').val('');
        })

        $('#saveBitMEXAccount').click(function (e) {
            e.preventDefault();
            var btn = $(this);
            var form = $('#bitmexAccountDetailsForm');
            console.log(form.data('method'));

            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true,
                    },
                    name: {
                        required: true,
                    },
                    apiKeyID: {
                        required: true,
                    },
                    apiKeySecret: {
                        required: true,
                    },
                },
                // messages: {
                //     email: "Por favor introduzca su correo electrónico",
                //     // email: "Please enter your Email",
                //     password: "Por favor introduzca su contraseña",
                //     // password: "Please enter your password",
                // },
            });

            if (!form.valid()) {
                return;
            }

            btn.attr('disabled', true);
            // btn.addClass('kt-loader kt-loader--right kt-loader--light').attr('disabled', true);

            form.ajaxSubmit({
                url: form[0].action,
                method: form.data('method'),
                success: function (response, status, xhr, $form) {
                    const result = response.result;
                    const message = response.message;
                    const data = response.data;
                    btn.attr('disabled', false);
                    if (result === 'success') {
                        $.ajax({
                            method: 'get',
                            url: '/accounts/bitmex/list',
                            dataType: 'json',
                            success: function (data) {
                                self.table.clear();
                                self.table.rows.add(data.data);
                                self.table.draw();
                            },
                        })
                        // self.table.rows.add([{
                        //     id: data.insertId,
                        //     email: $('e#mail').val(),
                        //     name: $('#name').val(),
                        //     testnet: !!$('#testnet').val() ? 1 : 0,
                        //     apiKeyID: $('#apiKeyID').val(),
                        //     apiKeySecret: $('#apiKeySecret').val(),
                        //     isParent: !!$('#isParent').val() ? 1 : 0,
                        // }]);
                        self.showErrorMsg(form, 'success', message);
                    } else if (result === 'error') {
                        self.showErrorMsg(form, 'danger', message);
                    }
                },
                error: function (error) {
                    btn.attr('disabled', false);
                    self.showErrorMsg(form, 'danger', 'Unknown error');
                }
            });
        });

        $('#closeModal').click(function (e) {

        })
    };

    this.formatRowDetail = function (d) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
            '<tr>' +
            '<td>Email:</td>' +
            '<td class="text-left">' + d.email + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Name:</td>' +
            '<td class="text-left">' + d.name + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Testnet?:</td>' +
            '<td class="text-left">' + (d.testnet ? 'Yes' : 'No') + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>ApiKeyID:</td>' +
            '<td class="text-left">' + d.apiKeyID + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>ApiKeySecret:</td>' +
            '<td class="text-left">' + d.apiKeySecret + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Parent?:</td>' +
            '<td class="text-left">' + (d.isParent ? 'Yes' : 'No') + '</td>' +
            '</tr>' +
            '</table>';
    };

    this.editBitMEXAccount = function (idx) {
        let self = this;
        let form = $('#bitmexAccountDetailsForm');

        let data = self.table.row(idx).data();

        form.data('method', 'put');
        form.data('accountId', data.id);

        $('#accountId').val(data.id);
        $('#email').val(data.email);
        $('#name').val(data.name);
        $('#testnet').val(data.testnet);
        $('#apiKeyID').val(data.apiKeyID);
        $('#apiKeySecret').val(data.apiKeySecret);
        $('#isParent').val(data.isParent);
        $('#bitmexAccountDetailsModal').modal('show');
        // console.log(idx);
    };
    this.deleteBitMEXAccount = function (id) {
        let self = this;
        let form = $('#bitmexAccountDetailsForm');
        form.data('method', 'delete');
        form.data('accountId', id);
        $('#accountId').val(id);

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
                            url: '/accounts/bitmex/list',
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
    accounts = new Accounts();
    accounts.init();
});
