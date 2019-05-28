let service = {
    ioServer: undefined,
    // clients: [],
    wallets: {},
    positions: {},
    orders: {},
    serveAccountIds: {},
    walletsClientSockets: [],
    positionsClientSockets: [],
    ordersClientSockets: [],

    initSocketIOServer: (ioServer) => {
        service.ioServer = ioServer;
        // service.ioServer.on('ping', (data) => {
        //     console.log('ping', data);
        // });
        service.walletsClientSockets = [];
        service.positionsClientSockets = [];

        service.ioServer.on('connection', (socket) => {
            // service.clients.push(socket);
            // console.log('connection', socket.id);
            service.serveAccountIds[socket.id] = [];
            socket.on('alive?', (data) => {
                socket.emit('alive', socket.id);
                console.log('alive?', socket.id, data);
            });

            socket.on('requestAccounts', (data) => {
                console.log('requestAccounts', socket.id, data);
                service.serveAccountIds[socket.id] = JSON.parse(data);
            });

            socket.on('wallets?', (data) => {
                service.walletsClientSockets.push(socket);
                // console.log(service.walletsClientSockets.length);
            });

            socket.on('positions?', (data) => {
                service.positionsClientSockets.push(socket);
                // console.log(service.positionsClientSockets.length);
            });

            socket.on('orders?', (data) => {
                service.ordersClientSockets.push(socket);
                // console.log(service.positionsClientSockets.length);
            });

            socket.on('wallets??', (data) => {
                let ioData = {};
                for (let accountId of service.serveAccountIds[socket.id]) {
                    if (typeof service.wallets[accountId] !== 'undefined') {
                        ioData[accountId] = service.wallets[accountId];
                    }
                }
                socket.emit('wallets', ioData);
            });

            socket.on('positions??', (data) => {
                let ioData = {};
                for (let accountId of service.serveAccountIds[socket.id]) {
                    if (typeof service.positions[accountId] !== 'undefined') {
                        ioData[accountId] = service.positions[accountId];
                    }
                }
                socket.emit('positions', ioData);
            });

            socket.on('orders??', (data) => {
                let ioData = {};
                for (let accountId of service.serveAccountIds[socket.id]) {
                    if (typeof service.orders[accountId] !== 'undefined') {
                        ioData[accountId] = service.orders[accountId];
                    }
                }
                socket.emit('orders', ioData);
            });

            socket.on('wallets', (data) => {
                // console.log('wallets', data);
                const json = JSON.parse(data);

                service.wallets = {};

                Object.entries(json).forEach(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    // Object.entries(value).forEach(entry => {
                    //     let key1 = entry[0];
                    //     let value1 = entry[1];
                    //     service.wallets.push(value1);
                    // });
                    service.wallets[value.accountId] = value;
                });

                for (let client of service.walletsClientSockets) {
                    let ioData = {};
                    for (let accountId of service.serveAccountIds[client.id]) {
                        if (typeof service.wallets[accountId] !== 'undefined') {
                            ioData[accountId] = service.wallets[accountId];
                        }
                    }
                    client.emit('wallets', ioData);
                }
                // console.log('wallets', JSON.stringify(service.wallets));
            });

            socket.on('positions', (data) => {
                const json = JSON.parse(data);

                service.positions = {};

                Object.entries(json).forEach(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    let symbols = [];
                    Object.entries(value).forEach(entry => {
                        let key1 = entry[0];
                        let value1 = entry[1];
                        if (value1.isOpen) {
                            if (!key1.includes('accountId')) {
                                symbols.push(value1);
                            }
                        }
                    });
                    service.positions[value.accountId] = symbols;
                });


                for (let client of service.positionsClientSockets) {
                    // console.log('positions', client.id, service.serveAccountIds);
                    let ioData = {};
                    for (let accountId of service.serveAccountIds[client.id]) {
                        if (typeof service.positions[accountId] !== 'undefined') {
                            ioData[accountId] = service.positions[accountId];
                        }
                    }
                    client.emit('positions', ioData);
                }
                // console.log('positions', JSON.stringify(service.positions));
            });

            socket.on('orders', (data) => {
                // console.log(data);
                service.orders = JSON.parse(data);
                for (let client of service.ordersClientSockets) {
                    let ioData = {};
                    for (let accountId of service.serveAccountIds[client.id]) {
                        if (typeof service.positions[accountId] !== 'undefined') {
                            ioData[accountId] = service.orders[accountId];
                        }
                    }
                    client.emit('orders', ioData);
                }
            });
        });
    },

    remakeAllSockets: () => {
        service.ioServer.emit('remakeAllSocket');
    }
};

module.exports = service;
