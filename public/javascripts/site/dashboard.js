// "use strict";
// Class definition

let dashboard;

var Dashboard = function () {
    this.formatNumber = function (num, precision) {
        return num.toFixed(precision).toString();
        // return num.toPrecision(precision).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    this.accountId = undefined;

    this.init = function () {
        let self = this;
        $('#kt_select2_account').select2({
            placeholder: "Select a account",
            // allowClear: true,
        });

        $('#kt_select2_account').on('select2:select', function (e) {
            const data = e.params.data;
            self.accountId = data.id;
            self.socket.emit('requestAccounts', JSON.stringify([self.accountId]));
            self.socket.emit('wallets??');
            self.socket.emit('positions??');
            self.socket.emit('orders??');
            // self.socket.emit('wallets?');
            // self.socket.emit('positions?');
            // self.socket.emit('orders?');
            // console.log('select event', accountId);
            // $.ajax({
            //     method: 'POST',
            //     url: '/dashboard/requestBitmexAccount',
            //     data: {
            //         accountId: accountId,
            //     },
            // })
        });

        this.table = $('#position').DataTable({
            data: [],
            columns: [
                // {
                //     // width: '3%',
                //     className: 'details-control',
                //     orderable: false,
                //     data: null,
                //     defaultContent: '<i class="fa fa-caret-right"></i>'
                // },
                {
                    // width: '12%',
                    data: "symbol"
                },
                {
                    // width: '10%',
                    data: "currentQty"
                },
                {
                    // width: '10%',
                    data: "homeNotional",
                    render: $.fn.dataTable.render.number(',', '.', 4, ''),
                },
                {
                    data: "avgEntryPrice",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                },
                {
                    data: "markPrice",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                },
                {
                    data: "liquidationPrice",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                },
                {
                    data: "leverage",
                    // render: $.fn.dataTable.render.number(',', '.', 2, ''),
                },
                {
                    // width: '10%',
                    data: "unrealisedPnl",
                    // render: $.fn.dataTable.render.number(',', '.', 4, ''),
                    render: function (data, type, row) {
                        return self.formatNumber(data / 100000000, 4);
                    }
                },
                {
                    // width: '10%',
                    data: "realisedPnl",
                    // render: $.fn.dataTable.render.number(',', '.', 4, ''),
                    render: function (data, type, row) {
                        return self.formatNumber(data / 100000000, 4);
                    }
                },
            ],
            order: [],
            language: {
                search: "",
                sLengthMenu: "_MENU_",
            },
        });


        // $('#position tbody').on('click', 'td', function () {
        //     var tr = $(this).closest('tr');
        //     var row = dashboard.table.row(tr);
        //
        //     if (row.child.isShown()) {
        //         // This row is already open - close it
        //         row.child.hide();
        //         tr.find(">:first-child").html('<i class="fa fa-caret-right"></i>');
        //     } else {
        //         // Open this row
        //         row.child(dashboard.formatRowDetail(row.data())).show();
        //         tr.find(">:first-child").html('<i class="fa fa-caret-down"></i>');
        //     }
        // });

        // $('table.display').DataTable();
        // setInterval(() => {
        //     this.table.cell(0, 3).data(new Date().getTime() % 10000);
        // }, 1000);
        this.socket = io('localhost:3000', {
            reconnection: true,
            reconnectionDelay: 2000,
            reconnectionDelayMax: 4000,
            reconnectionAttempts: Infinity
        });
        this.socket.on('message', (data) => {
            console.log(data);
        });
        this.socket.on('alive', (data) => {
            console.log('socket-io', 'alive', data);
        });
        this.socket.on('connect', () => {
            // console.log('socket-io', 'connect');
            if (!!self.accountId) {
                self.socket.emit('requestAccounts', JSON.stringify([self.accountId]));
                self.socket.emit('wallets??');
                self.socket.emit('positions??');
                self.socket.emit('orders??');
                self.socket.emit('wallets?');
                self.socket.emit('positions?');
                self.socket.emit('orders?');
            }
        });

        this.socket.on('wallets', (data) => {
            // console.log('socket-io', 'wallets', data);
        });
        this.socket.on('positions', (data) => {
            // console.log('socket-io', 'positions', data);
            // data = JSON.parse(data);

            let newData = [];
            Object.entries(data).forEach(entry => {
                let key = entry[0];
                let value = entry[1];
                newData = value;
            });

            this.table.clear();
            this.table.rows.add(newData);
            this.table.draw();
        });
        this.socket.on('orders', (data) => {
            console.log('socket-io', 'orders', data);
        });
    };
};

jQuery(document).ready(function () {
    dashboard = new Dashboard();
    dashboard.init();
});
