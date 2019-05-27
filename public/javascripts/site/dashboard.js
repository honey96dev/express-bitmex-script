// "use strict";
// Class definition

let dashboard;

var Dashboard = function () {
    this.formatNumber = function (num, precision) {
        return num.toFixed(precision).toString();
        // return num.toPrecision(precision).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    this.init = function () {
        let self = this;
        $('#kt_select2_account').select2({
            placeholder: "Select a account",
            // allowClear: true,
        });

        $('#kt_select2_account').on('select2:select', function (e) {
            const data = e.params.data;
            const accountId = data.id;
            self.socket.emit('requestAccounts', JSON.stringify([accountId]));
            self.socket.emit('wallets??');
            self.socket.emit('positions??');
            // console.log('select event', accountId);
            // $.ajax({
            //     method: 'POST',
            //     url: '/dashboard/requestBitmexAccount',
            //     data: {
            //         accountId: accountId,
            //     },
            // })
        });

        var dataSet = [
            {
                "account": 204690,
                "symbol": "XBTUSD",
                "leverage": 2,
                "crossMargin": false,
                "currentQty": 48,
                "markPrice": 8001.28,
                "homeNotional": 0.00599904,
                "realisedPnl": 75,
                "unrealisedPnl": 1421,
                "avgEntryPrice": 7982.7572,
                "liquidationPrice": 5335,
            },
            {
                "account": 204690,
                "symbol": "ADAM19",
                "currency": "XBt",
                "underlying": "ADA",
                "quoteCurrency": "XBT",
                "commission": 0.0025,
                "initMarginReq": 0.05,
                "maintMarginReq": 0.025,
                "riskLimit": 5000000000,
                "leverage": 20,
                "crossMargin": true,
                "deleveragePercentile": null,
                "rebalancedPnl": 0,
                "prevRealisedPnl": -412,
                "prevUnrealisedPnl": 0,
                "prevClosePrice": 0.00001036,
                "openingTimestamp": "2019-05-26T08:00:00.000Z",
                "openingQty": 0,
                "openingCost": 0,
                "openingComm": 0,
                "openOrderBuyQty": 0,
                "openOrderBuyCost": 0,
                "openOrderBuyPremium": 0,
                "openOrderSellQty": 0,
                "openOrderSellCost": 0,
                "openOrderSellPremium": 0,
                "execBuyQty": 0,
                "execBuyCost": 0,
                "execSellQty": 0,
                "execSellCost": 0,
                "execQty": 0,
                "execCost": 0,
                "execComm": 0,
                "currentTimestamp": "2019-05-26T08:00:00.397Z",
                "currentQty": 0,
                "currentCost": 0,
                "currentComm": 0,
                "realisedCost": 0,
                "unrealisedCost": 0,
                "grossOpenCost": 0,
                "grossOpenPremium": 0,
                "grossExecCost": 0,
                "isOpen": false,
                "markPrice": null,
                "markValue": 0,
                "riskValue": 0,
                "homeNotional": 0,
                "foreignNotional": 0,
                "posState": "",
                "posCost": 0,
                "posCost2": 0,
                "posCross": 0,
                "posInit": 0,
                "posComm": 0,
                "posLoss": 0,
                "posMargin": 0,
                "posMaint": 0,
                "posAllowance": 0,
                "taxableMargin": 0,
                "initMargin": 0,
                "maintMargin": 0,
                "sessionMargin": 0,
                "targetExcessMargin": 0,
                "varMargin": 0,
                "realisedGrossPnl": 0,
                "realisedTax": 0,
                "realisedPnl": 0,
                "unrealisedGrossPnl": 0,
                "longBankrupt": 0,
                "shortBankrupt": 0,
                "taxBase": 0,
                "indicativeTaxRate": 0,
                "indicativeTax": 0,
                "unrealisedTax": 0,
                "unrealisedPnl": 0,
                "unrealisedPnlPcnt": 0,
                "unrealisedRoePcnt": 0,
                "simpleQty": null,
                "simpleCost": null,
                "simpleValue": null,
                "simplePnl": null,
                "simplePnlPcnt": null,
                "avgCostPrice": null,
                "avgEntryPrice": null,
                "breakEvenPrice": null,
                "marginCallPrice": null,
                "liquidationPrice": null,
                "bankruptPrice": null,
                "timestamp": "2019-05-26T08:00:00.397Z",
                "lastPrice": null,
                "lastValue": 0
            },
            {
                "account": 204690,
                "symbol": "XBTJPY",
                "currency": "XBt",
                "underlying": "XBT",
                "quoteCurrency": "JPY",
                "commission": 0.00075,
                "initMarginReq": 0.02,
                "maintMarginReq": 0.005,
                "riskLimit": 20000000000,
                "leverage": 50,
                "crossMargin": false,
                "deleveragePercentile": null,
                "rebalancedPnl": 0,
                "prevRealisedPnl": -134,
                "prevUnrealisedPnl": 0,
                "prevClosePrice": 885434.1800000002,
                "openingTimestamp": "2019-05-26T08:00:00.000Z",
                "openingQty": 0,
                "openingCost": 0,
                "openingComm": 0,
                "openOrderBuyQty": 0,
                "openOrderBuyCost": 0,
                "openOrderBuyPremium": 0,
                "openOrderSellQty": 0,
                "openOrderSellCost": 0,
                "openOrderSellPremium": 0,
                "execBuyQty": 0,
                "execBuyCost": 0,
                "execSellQty": 0,
                "execSellCost": 0,
                "execQty": 0,
                "execCost": 0,
                "execComm": 0,
                "currentTimestamp": "2019-05-26T08:00:00.397Z",
                "currentQty": 0,
                "currentCost": 0,
                "currentComm": 0,
                "realisedCost": 0,
                "unrealisedCost": 0,
                "grossOpenCost": 0,
                "grossOpenPremium": 0,
                "grossExecCost": 0,
                "isOpen": false,
                "markPrice": null,
                "markValue": 0,
                "riskValue": 0,
                "homeNotional": 0,
                "foreignNotional": 0,
                "posState": "",
                "posCost": 0,
                "posCost2": 0,
                "posCross": 0,
                "posInit": 0,
                "posComm": 0,
                "posLoss": 0,
                "posMargin": 0,
                "posMaint": 0,
                "posAllowance": 0,
                "taxableMargin": 0,
                "initMargin": 0,
                "maintMargin": 0,
                "sessionMargin": 0,
                "targetExcessMargin": 0,
                "varMargin": 0,
                "realisedGrossPnl": 0,
                "realisedTax": 0,
                "realisedPnl": 0,
                "unrealisedGrossPnl": 0,
                "longBankrupt": 0,
                "shortBankrupt": 0,
                "taxBase": 0,
                "indicativeTaxRate": 0,
                "indicativeTax": 0,
                "unrealisedTax": 0,
                "unrealisedPnl": 0,
                "unrealisedPnlPcnt": 0,
                "unrealisedRoePcnt": 0,
                "simpleQty": null,
                "simpleCost": null,
                "simpleValue": null,
                "simplePnl": null,
                "simplePnlPcnt": null,
                "avgCostPrice": null,
                "avgEntryPrice": null,
                "breakEvenPrice": null,
                "marginCallPrice": null,
                "liquidationPrice": null,
                "bankruptPrice": null,
                "timestamp": "2019-05-26T08:00:00.397Z",
                "lastPrice": null,
                "lastValue": 0
            },
            {
                "account": 204690,
                "symbol": "ETHXBT",
                "currency": "XBt",
                "underlying": "ETH",
                "quoteCurrency": "XBT",
                "commission": 0.00075,
                "initMarginReq": 0.02857142857142857,
                "maintMarginReq": 0.01,
                "riskLimit": 5000000000,
                "leverage": 35,
                "crossMargin": false,
                "deleveragePercentile": null,
                "rebalancedPnl": 0,
                "prevRealisedPnl": -214751,
                "prevUnrealisedPnl": 0,
                "prevClosePrice": 0.03163,
                "openingTimestamp": "2019-05-26T08:00:00.000Z",
                "openingQty": 0,
                "openingCost": 0,
                "openingComm": 0,
                "openOrderBuyQty": 0,
                "openOrderBuyCost": 0,
                "openOrderBuyPremium": 0,
                "openOrderSellQty": 0,
                "openOrderSellCost": 0,
                "openOrderSellPremium": 0,
                "execBuyQty": 0,
                "execBuyCost": 0,
                "execSellQty": 0,
                "execSellCost": 0,
                "execQty": 0,
                "execCost": 0,
                "execComm": 0,
                "currentTimestamp": "2019-05-26T08:00:00.397Z",
                "currentQty": 0,
                "currentCost": 0,
                "currentComm": 0,
                "realisedCost": 0,
                "unrealisedCost": 0,
                "grossOpenCost": 0,
                "grossOpenPremium": 0,
                "grossExecCost": 0,
                "isOpen": false,
                "markPrice": null,
                "markValue": 0,
                "riskValue": 0,
                "homeNotional": 0,
                "foreignNotional": 0,
                "posState": "",
                "posCost": 0,
                "posCost2": 0,
                "posCross": 0,
                "posInit": 0,
                "posComm": 0,
                "posLoss": 0,
                "posMargin": 0,
                "posMaint": 0,
                "posAllowance": 0,
                "taxableMargin": 0,
                "initMargin": 0,
                "maintMargin": 0,
                "sessionMargin": 0,
                "targetExcessMargin": 0,
                "varMargin": 0,
                "realisedGrossPnl": 0,
                "realisedTax": 0,
                "realisedPnl": 0,
                "unrealisedGrossPnl": 0,
                "longBankrupt": 0,
                "shortBankrupt": 0,
                "taxBase": 0,
                "indicativeTaxRate": 0,
                "indicativeTax": 0,
                "unrealisedTax": 0,
                "unrealisedPnl": 0,
                "unrealisedPnlPcnt": 0,
                "unrealisedRoePcnt": 0,
                "simpleQty": null,
                "simpleCost": null,
                "simpleValue": null,
                "simplePnl": null,
                "simplePnlPcnt": null,
                "avgCostPrice": null,
                "avgEntryPrice": null,
                "breakEvenPrice": null,
                "marginCallPrice": null,
                "liquidationPrice": null,
                "bankruptPrice": null,
                "timestamp": "2019-05-26T08:00:00.397Z",
                "lastPrice": null,
                "lastValue": 0
            },
        ];
        this.table = $('#position').DataTable({
            data: dataSet,
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
            console.log('socket-io', 'connect');
            self.socket.emit('wallets?');
            self.socket.emit('positions?');
            self.socket.emit('wallets??');
            self.socket.emit('positions??');
        });

        this.socket.on('wallets', (data) => {
            console.log('socket-io', 'wallets', data);
        });
        this.socket.on('positions', (data) => {
            console.log('socket-io', 'positions', data);
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
    };

    this.addRow = function () {
        // this.table.row.add({
        //     // "id": "5",
        //     "name": "Airi Satou - repeat",
        //     "position": "Accountant",
        //     "salary": "$162,700",
        //     "start_date": "2008/11/28",
        //     "office": "Tokyo",
        //     "extn": "5407"
        // }).draw();
    };

    this.formatRowDetail = function (d) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
            '<tr>' +
            '<td>Full name:</td>' +
            '<td>' + d.name + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Extension number:</td>' +
            '<td>' + d.extn + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Extra info:</td>' +
            '<td>And any further details here (images etc)...</td>' +
            '</tr>' +
            '</table>';
    };
};

jQuery(document).ready(function () {
    dashboard = new Dashboard();
    dashboard.init();
    dashboard.addRow();
});
