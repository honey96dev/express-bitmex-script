// "use strict";
// Class definition

let wallet;

var Wallet = function () {
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
            self.socket.emit('wallets?');
        });

        this.table = $('#wallet').DataTable({
            data: [],
            columns: [
                {
                    data: "btc",
                    render: $.fn.dataTable.render.number(',', '.', 4, ''),
                    className: "text-center",
                }, {
                    data: "satoshi",
                    render: $.fn.dataTable.render.number(',', '.', 2, ''),
                    className: "text-center",
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
            if (!!self.accountId) {
                self.socket.emit('requestAccounts', JSON.stringify([self.accountId]));
                self.socket.emit('wallets??');
                self.socket.emit('wallets?');
            }
        });
        this.socket.on('wallets', (data) => {
            let newData = [];
            Object.entries(data).forEach(entry => {
                let key = entry[0];
                let value = entry[1];
                newData = value;
            });

            let wallet = [];
            wallet.push({
                btc: newData.amount / 100000000,
                satoshi: newData.amount,
            });

            this.table.clear();
            this.table.rows.add(wallet);
            this.table.draw();
        });
    };
};

jQuery(document).ready(function () {
    wallet = new Wallet();
    wallet.init();
});
