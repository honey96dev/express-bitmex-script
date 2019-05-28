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
            self.socket.emit('wallets?');
            self.socket.emit('positions?');
            self.socket.emit('orders?');
            // console.log('select event', accountId);
            // $.ajax({
            //     method: 'POST',
            //     url: '/dashboard/requestBitmexAccount',
            //     data: {
            //         accountId: accountId,
            //     },
            // })
        });

        this.positionsTable = $('#positions').DataTable({
            data: [],
            columns: [
                {
                    data: "symbol"
                }, {
                    data: "currentQty"
                }, {
                    data: "homeNotional",
                    render: $.fn.dataTable.render.number(',', '.', 4, ''),
                }, {
                    data: "avgEntryPrice",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                }, {
                    data: "markPrice",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                }, {
                    data: "liquidationPrice",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                }, {
                    data: "leverage",
                }, {
                    data: "unrealisedPnl",
                    render: function (data, type, row) {
                        return self.formatNumber(data / 100000000, 4);
                    }
                }, {
                    data: "realisedPnl",
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

        this.activeOrdersTable = $('#active_orders').DataTable({
            data: [],
            columns: [
                {
                    data: "side",
                }, {
                    data: "symbol",
                }, {
                    data: "orderQty",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                }, {
                    data: "price",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                }, {
                    data: "filledQty",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                }, {
                    data: "remainingQty",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                }, {
                    data: "orderValue",
                    render: $.fn.dataTable.render.number(',', '.', 4, ''),
                }, {
                    data: "fillPrice",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                }, {
                    data: "ordType",
                }, {
                    data: "ordStatus",
                }, {
                    data: "time",
                }, {
                    width: '5%',
                    data: 'orderID',
                    render: function (data, type, row) {
                        return '<button class="btn btn-clean btn-sm btn-icon" onclick="dashboard.cancelOrder(\'' + data + '\')"><i class="fa fa-trash margin-auto"></i></button>';
                    },
                    orderable: false,
                },
            ],
            order: [],
            language: {
                search: "",
                sLengthMenu: "_MENU_",
            },
        });

        this.stopOrdersTable = $('#stop_orders').DataTable({
            data: [],
            columns: [
                {
                    data: "side",
                }, {
                    data: "symbol",
                }, {
                    data: "orderQty",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                }, {
                    data: "price",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                }, {
                    data: "filledQty",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                }, {
                    data: "stopPx",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                }, {
                    data: "triggeringPx",
                    render: $.fn.dataTable.render.number(',', '.', 4, ''),
                }, {
                    data: "fillPrice",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                }, {
                    data: "ordType",
                }, {
                    data: "ordStatus",
                }, {
                    data: "time",
                }, {
                    width: '5%',
                    data: 'orderID',
                    render: function (data, type, row) {
                        return '<button class="btn btn-clean btn-sm btn-icon" onclick="dashboard.cancelOrder(\'' + data + '\')"><i class="fa fa-trash margin-auto"></i></button>';
                    },
                    orderable: false,
                },
            ],
            order: [],
            language: {
                search: "",
                sLengthMenu: "_MENU_",
            },
        });

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

            this.positionsTable.clear();
            this.positionsTable.rows.add(newData);
            this.positionsTable.draw();
        });
        this.socket.on('orders', (data) => {
            console.log('socket-io', 'orders', data);let newData = [];
            Object.entries(data).forEach(entry => {
                let key = entry[0];
                let value = entry[1];
                newData = value;
            });

            let activeOrders = [];
            let stopOrders = [];
            let order;
            for (let item of newData) {
                order = {
                    side: item.side,
                    symbol: item.symbol,
                    orderQty: item.orderQty,
                    price: !!item.price ? item.price : 'Market',
                    filledQty: !!item.leavesQty ? item.orderQty - item.leavesQty : 0,
                    remainingQty: !!item.leavesQty ? item.leavesQty : item.orderQty,
                    stopPx: !!item.stopPx ? item.stopPx : 0,
                    triggeringPx: 0,
                    orderValue: 0,
                    fillPrice: 0,
                    ordType: item.ordType,
                    ordStatus: item.ordStatus,
                    time: item.timestamp,
                    orderID: item.orderID,
                }
                if (!!item.stopPx) {
                    stopOrders.push(order);
                } else {
                    activeOrders.push(order);
                }
            }
            console.log('activeOrders', activeOrders);
            console.log('stopOrders', stopOrders);
            this.activeOrdersTable.clear();
            this.activeOrdersTable.rows.add(activeOrders);
            this.activeOrdersTable.draw();
            this.stopOrdersTable.clear();
            this.stopOrdersTable.rows.add(stopOrders);
            this.stopOrdersTable.draw();
        });
    };

    this.cancelOrder = function (orderID) {
        let self = this;
        const button = confirm('Really?');
        if (button) {
            this.socket.emit('cancelOrder', JSON.stringify({
                accountId: self.accountId,
                orderID: orderID,
            }));
        }
    }
};

jQuery(document).ready(function () {
    dashboard = new Dashboard();
    dashboard.init();
});
