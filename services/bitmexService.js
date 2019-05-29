import config from '../core/config';
import dbConn from '../core/dbConn';
import sprintfJs from 'sprintf-js';
import WebSocket from 'ws-reconnect';
import SocketIOClient from 'socket.io-client';
import request from 'request';
import crypto from 'crypto'
import {BitMEXApi, DELETE, GET, POST, PUT} from '../core/BitmexApi';
import _ from "lodash";

const map_to_object = map => {
    const object = {};
    map.forEach((value, key) => {
        if (value instanceof Map) {
            object[key] = map_to_object(value);
        } else {
            object[key] = value;
        }
    });
    return object;
};

const map_to_json = map => {
    const object = map_to_object(map)
    return JSON.stringify(object);
};

let service = {
    accounts: [],

    ioClient: undefined,
    wallets: new Map(),
    positions: new Map(),
    orders: new Map(),

    initSocketIOClient: () => {
        service.ioClient = SocketIOClient(config.server.baseUrl, {
            reconnection: true,
            reconnectionDelay: 2000,
            reconnectionDelayMax: 4000,
            reconnectionAttempts: Infinity
        });
        service.ioClient.on('remakeAllSocket', (data) => {
            service.initFromDb(config.bitmex.table, () => {
                service.wsOrderBookL2_25('*');
                service.wsOrder('*');
                service.wsExecution('*');
                service.wsPosition('*');
                service.wsWallet('*');
            });
        });
        service.ioClient.on('connect', () => {
            console.log('socket-io', 'connect');
            service.ioClient.emit('wallets', map_to_json(service.wallets));
            service.ioClient.emit('positions', map_to_json(service.positions));
            service.ioClient.emit('orders', map_to_json(service.orders));
        });
        service.ioClient.on('wallets?', (data) => {
            // console.log('socket-io', 'wallets?');
            service.ioClient.emit('wallets', map_to_json(service.wallets));
        });
        service.ioClient.on('positions?', (data) => {
            // console.log('socket-io', 'positions?');
            service.ioClient.emit('positions', map_to_json(service.positions));
        });
        service.ioClient.on('orders?', (data) => {
            // console.log('socket-io', 'positions?');
            service.ioClient.emit('orders', map_to_json(service.orders));
        });
        service.ioClient.on('alive', (data) => {
            console.log('socket-io', 'alive', data);
        });

        // setInterval(() => {
        //     if (service.ioClient.connected) {
        //         console.log('alive?', new Date());
        //         service.ioClient.emit('alive?', 'this is test', new Date().getTime());
        //     }
        // }, 2000);
    },

    signMessage: (secret, verb, url, nonce, data) => {
        if (!data || _.isEmpty(data)) data = '';
        else if (_.isObject(data)) data = JSON.stringify(data);

        return crypto.createHmac('sha256', secret).update(verb + url + nonce + data).digest('hex');
    },

    renewSocket: (account) => {
        const timestamp = new Date().getTime();
        if (account.renewSocketTimeoutId) {
            clearTimeout(account.renewSocketTimeoutId);
        }
        account.renewSocketTimeoutId = setTimeout(service.renewSocket, 30000, account);
        if (account.lastTimestamp > timestamp - 30000) {
            console.warn('renewSocket-still alive', account.id);
            return;
        }
        const wsUrl = Boolean(account.testnet) ? 'wss://testnet.bitmex.com/realtime' : 'wss://www.bitmex.com/realtime';
        let socket = new WebSocket(wsUrl, {
            retryCount: 2, // default is 2
            reconnectInterval: 1 // default is 5
        });
        console.warn('renewSocket', account.id, account.testnet, account.apiKeyID, account.apiKeySecret, wsUrl);

        socket.on('connect', () => {
            account.rest.getTimestamp((result) => {
                const expires = parseInt(result / 1000 + 5);
                const signature = service.signMessage(account.apiKeySecret, 'GET', '/realtime', expires);

                socket.send(JSON.stringify({
                    op: "authKeyExpires",
                    args: [account.apiKeyID, expires, signature],
                }));

                for (let subscribe of account.subscribes) {
                    socket.send(subscribe);
                }

                if (!!account.socket) {
                    account.socket.destroy();
                    // delete account.socket;
                }
                account.socket = socket;
            });
        });

        socket.on('message', (data) => {
            // const timestamp = new Date().getTime();
            account.lastTimestamp = new Date().getTime();
            data = JSON.parse(data);
            service.onWsMessage(data);
            // console.log(data);
            // console.log('message', account.id, JSON.stringify(data));
            if (!!data.request) {
                console.log('message', account.id, JSON.stringify(data));
                // if (!!data.request.op) {
                // }
            }
            if (!!data.table) {
                const table = data.table;
                if (table === 'order') {
                    service.onWsOrder(data.action, data.data, account);
                } else if (table === 'orderBookL2_25') {
                    service.onWsOrderBookL2_25(data.action, data.data, account);
                } else if (table === 'position') {
                    service.onWsPosition(data.action, data.data, account);
                } else if (table === 'wallet') {
                    service.onWsWallet(data.action, data.data, account);
                }
            }
        });

        socket.on('reconnect', (data) => {
            console.warn('reconnect', account.id, data);
            const timestamp = new Date().toISOString();
            let sql = sprintfJs.sprintf("INSERT INTO `bitmex_log`(`timestamp`, `email`, `testnet`, `apiKeyID`, `apiKeySecret`, `isParent`, `message`) VALUES ('', '', '', '', '', '', '') ON DUPLICATE KEY UPDATE `email` = VALUES(`email`), `testnet` = VALUES(`testnet`), `apiKeyID` = VALUES(`apiKeyID`), `apiKeySecret` = VALUES(`apiKeySecret`), `isParent` = VALUES(`isParent`), `message` = VALUES(`message`);", timestamp, account.email, account.testnet, account.apiKeyID, account.apiKeySecret, account.isParent, 'Websocket reconnecting');

            dbConn.query(sql);
            // dbConn.query(sql, null, (error, results, fields) => {});
            // account.socket.start();
        });

        socket.on('destroyed', (data) => {
            console.warn('destroyed', account.id, data);
        });

        socket.start();
    },

    init: (configs) => {
        for (let account of service.accounts) {
            delete account.rest;
            account.socket.destroy();
            delete account.socket;
        }
        service.accounts = [];
        for (let item of configs) {
            let account = {
                id: item.id,
                isParent: Boolean(item.isParent),
                rest: new BitMEXApi(Boolean(item.testnet), item.apiKeyID, item.apiKeySecret),
                socket: undefined,
                subscribes: [],
                email: Boolean(item.email),
                testnet: Boolean(item.testnet),
                apiKeyID: item.apiKeyID,
                apiKeySecret: item.apiKeySecret,
                lastTimestamp: 0,
            };

            service.accounts.push(account);

            account.renewSocketTimeoutId = setTimeout(service.renewSocket, 0, account);
        }
    },

    initFromDb: (tableName, callback) => {
        // let sql = sprintfJs.sprintf("SELECT A.* FROM `%s` A where id = 1;", tableName);
        let sql = sprintfJs.sprintf("SELECT A.* FROM `%s` A;", tableName);
        dbConn.query(sql, null, (error, results, fields) => {
            if (error) {
                console.error('initFromDb', error);
            } else {
                service.init(results);
                callback(results);
            }
        });

    },

    restPosition: (method, data, onFulfilled, onRejected) => {
        for (let account of service.accounts) {
            account.rest.position(method, data, (data) => {
                if (typeof onFulfilled === 'function') {
                    onFulfilled({
                        id: account.id,
                        data: data,
                    });
                }
            }, (error) => {
                if (typeof onRejected === 'function') {
                    onRejected({
                        id: account.id,
                        data: error,
                    });
                }
            });
        }
    },

    wsSubscribe: (command, symbol) => {
        const query = JSON.stringify({
            op: 'subscribe',
            args: command + ':' + symbol,
        });
        for (let account of service.accounts) {
            if (!!account.socket && account.socket.isConnected) {
                account.socket.send(query);
            } else {
                account.subscribes.push(query);
            }
        }
    },

    wsOrderBookL2_25: (symbol) => {
        service.wsSubscribe('orderBookL2_25', symbol);
    },

    wsExecution: (symbol) => {
        service.wsSubscribe('execution', symbol);
    },

    wsOrder: (symbol) => {
        service.wsSubscribe('order', symbol);
    },

    wsPosition: (symbol) => {
        service.wsSubscribe('position', symbol);
    },

    wsWallet: (symbol) => {
        service.wsSubscribe('wallet', symbol);
    },

    onWsMessage: (data) => {
        if (!!service.ioClient && service.ioClient.connected) {
            service.ioClient.emit('message', JSON.stringify(data));
        }
    },

    onWsOrder: (action, data, account) => {
        // console.log('onWsOrder', new Date(), account.id, action, JSON.stringify(data));
        if (action === 'partial') {
            service.orders.set(account.id, data);
        } else if (action === 'insert') {
            const rest = account.rest;
            if (account.isParent) {
                for (let account1 of service.accounts) {
                    if (account1.isParent) continue;

                    const headers = {
                        'content-type': 'application/json',
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'testnet': account1.testnet,
                        'apikeyid': account1.apiKeyID,
                        'apikeysecret': account1.apiKeySecret,
                    };
                    let body;
                    for (let item of data) {
                        body = {
                            order: item,
                            isClone: true,
                        };
                        if (!body || _.isEmpty(body)) body = '';
                        else if (_.isObject(body)) body = JSON.stringify(body);
                        console.log('clone to', account1.id, body);

                        const requestOptions = {
                            headers: headers,
                            url: config.server.baseUrl + 'rest/order',
                            method: POST,
                            body: body
                        };
                        request(requestOptions);
                    }
                }
            }

            let orders = service.orders.get(account.id);
            for (let item of data) {
                let flag = true;
                for (let order of orders) {
                    if (item.orderID === order.orderID) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    orders.push(item);
                }
            }
        } else if (action === 'update') {
            const rest = account.rest;
            if (account.isParent) {
                for (let account1 of service.accounts) {
                    if (account1.isParent) continue;

                    const headers = {
                        'content-type': 'application/json',
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'testnet': account1.testnet,
                        'apikeyid': account1.apiKeyID,
                        'apikeysecret': account1.apiKeySecret,
                    };
                    let body;
                    for (let item of data) {
                        if (typeof item.ordStatus !== 'undefined' && item.ordStatus === 'Canceled') {
                            body = {
                                order: item,
                                isClone: true,
                            };
                            if (!body || _.isEmpty(body)) body = '';
                            else if (_.isObject(body)) body = JSON.stringify(body);
                            console.log('clone to', account1.id, body);

                            const requestOptions = {
                                headers: headers,
                                url: config.server.baseUrl + 'rest/order',
                                method: DELETE,
                                body: body
                            };
                            request(requestOptions);
                        } else if (typeof item.orderQty !== 'undefined') {
                            body = {
                                orderID: item.orderID,
                                orderQty: item.orderQty,
                                isClone: true,
                            };
                            if (!body || _.isEmpty(body)) body = '';
                            else if (_.isObject(body)) body = JSON.stringify(body);
                            console.log('clone to', account1.id, body);

                            const requestOptions = {
                                headers: headers,
                                url: config.server.baseUrl + 'rest/order',
                                method: PUT,
                                body: body
                            };
                            request(requestOptions);
                        } else if (typeof item.price !== 'undefined') {
                            body = {
                                orderID: item.orderID,
                                price: item.price,
                                isClone: true,
                            };
                            if (!body || _.isEmpty(body)) body = '';
                            else if (_.isObject(body)) body = JSON.stringify(body);
                            console.log('clone to', account1.id, body);

                            const requestOptions = {
                                headers: headers,
                                url: config.server.baseUrl + 'rest/order',
                                method: PUT,
                                body: body
                            };
                            request(requestOptions);
                        } else if (typeof item.stopPx !== 'undefined' || typeof item.pegOffsetValue !== 'undefined') {
                            body = {
                                orderID: item.orderID,
                                stopPx: item.stopPx,
                                pegOffsetValue: item.pegOffsetValue,
                                isClone: true,
                            };
                            if (!body || _.isEmpty(body)) body = '';
                            else if (_.isObject(body)) body = JSON.stringify(body);
                            console.log('clone to', account1.id, body);

                            const requestOptions = {
                                headers: headers,
                                url: config.server.baseUrl + 'rest/order',
                                method: PUT,
                                body: body
                            };
                            request(requestOptions);
                        }
                    }
                }
            }

            let orders = service.orders.get(account.id);
            let idx;
            const cnt = orders.length - 1;
            for (let item of data) {
                for (idx = cnt; idx >= 0; idx--) {
                    if (item.orderID === orders[idx].orderID) {
                        // console.log('orders[idx].ordStatus', orders[idx].ordStatus);
                        if (item.ordStatus === 'Filled' || item.ordStatus === 'Canceled') {
                            // console.log('orders[idx]1234', orders[idx].ordStatus);
                            orders.splice(idx, 1);
                        } else {
                            Object.entries(item).forEach(entry => {
                                let key = entry[0];
                                let value = entry[1];
                                orders[idx][key] = value;
                            });
                        }
                        break;
                    }
                }
            }
            service.orders.set(account.id, orders);
        }

        if (!!service.ioClient && service.ioClient.connected) {
            // console.log(service.orders);
            service.ioClient.emit('orders', map_to_json(service.orders));
        }
    },

    onWsOrderBookL2_25: (action, data, account) => {
        // console.log('onWsOrderBookL2_25', account.id, action, JSON.stringify(data));
    },

    onWsPosition: (action, data, account) => {
        // console.log('onWsPosition', new Date(), account.id, action, JSON.stringify(data));

        if (action === 'partial') {
            for (let item of data) {
                if (typeof service.positions.get(item.account) === 'undefined') {
                    let map = new Map();
                    map.set('accountId', account.id);
                    service.positions.set(item.account, map);
                }
                let position = service.positions.get(item.account);
                position.set(item.symbol, item);
            }
            // service.positions
        } else if (action === 'insert') {

        } else if (action === 'update') {
            const rest = account.rest;

            for (let item of data) {
                if (typeof service.positions.get(item.account) === 'undefined') {
                    service.positions.set(item.account, new Map());
                }
                let position = service.positions.get(item.account).get(item.symbol);
                if (typeof position === 'undefined') {
                    position = {};
                }
                Object.entries(item).forEach(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    position[key] = value;
                    //use key and value here
                });
                // if (typeof position.get(item.symbol) === 'undefined') {
                //     position.set(item.symbol, new Map());
                // }
                // position = service.positions.get(item.account).get(item.symbol);
                // position
                service.positions.get(item.account).set(item.symbol, position);
            }

            if (account.isParent) {
                for (let account1 of service.accounts) {
                    if (account1.isParent) continue;

                    const headers = {
                        'content-type': 'application/json',
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'testnet': account1.testnet,
                        'apikeyid': account1.apiKeyID,
                        'apikeysecret': account1.apiKeySecret,
                    };
                    let body;
                    for (let item of data) {
                        if (!!item.leverage) {
                            body = {
                                symbol: item.symbol,
                                leverage: !!item.crossMargin ? 0 : item.leverage,
                            };
                            if (!body || _.isEmpty(body)) body = '';
                            else if (_.isObject(body)) body = JSON.stringify(body);
                            console.log('clone to', account1.id, body);

                            const requestOptions = {
                                headers: headers,
                                url: config.server.baseUrl + 'rest/positionLeverage',
                                method: POST,
                                body: body
                            };
                            request(requestOptions);
                        }
                    }
                }
            }
        }

        if (!!service.ioClient && service.ioClient.connected) {
            // console.log('service.positions', map_to_object(service.positions));
            service.ioClient.emit('positions', map_to_json(service.positions));
        }
    },

    onWsWallet: (action, data, account) => {
        // console.log('onWsWallet', account.id, action, JSON.stringify(data));
        if (action === 'partial') {
            if (data.length > 0) {
                let item = data[0];
                item['accountId'] = account.id;
                service.wallets.set(item.account, item);

            }
        } else if (action === 'update') {

        }
        // if (account.isParent && !!service.ioClient && service.ioClient.connected) {
        if (!!service.ioClient && service.ioClient.connected) {
            service.ioClient.emit('wallets', map_to_json(service.wallets));
        }
    },
};
module.exports = {BitMEXService: service, GET, POST, PUT, DELETE};
