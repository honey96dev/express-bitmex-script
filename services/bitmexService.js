import dbConn from '../core/dbConn';
import sprintfJs from 'sprintf-js';
import WebSocket from 'ws-reconnect';
import request from 'request';
import crypto from 'crypto'
import {BitMEXApi, GET, POST, PUT, DELETE} from '../core/BitmexApi';

let service = {
    accounts: [],

    signMessage: (secret, verb, url, nonce, data) => {
        if (!data || _.isEmpty(data)) data = '';
        else if (_.isObject(data)) data = JSON.stringify(data);

        return crypto.createHmac('sha256', secret).update(verb + url + nonce + data).digest('hex');
    },

    init: (configs) => {
        service.accounts = [];
        for (let item of configs) {
            let account = {
                id: item.id,
                // socket: new BitMEXClient({
                //     testnet: item.testnet == 1,
                //     apiKeyID: item.apiKeyID,
                //     apiKeySecret: item.apiKeySecret,
                //     maxTableLen: item.maxTableLen
                // }),
                rest: new BitMEXApi(item.testnet == 1, item.apiKeyID, item.apiKeySecret),
                socket: new WebSocket(item.testnet ? 'wss://testnet.bitmex.com/realtime' : 'wss://www.bitmex.com/realtime', {
                    retryCount: 2, // default is 2
                    reconnectInterval: 1 // default is 5
                }),
                subscribes: [],
            };
            service.accounts.push(account);

            account.socket.on('connect', () => {
                const url = item.testnet ? 'https://testnet.bitmex.com/api/v1' : 'https://www.bitmex.com/api/v1';

                request(url, (error, response, body) => {
                    if (!response || response.statusCode !== 200) {
                        return;
                    }
                    const result = JSON.parse(body);

                    const expires = parseInt(result.timestamp / 1000 + 5);
                    const signature = service.signMessage(item.apiKeySecret, 'GET', '/realtime', expires);

                    account.socket.send(JSON.stringify({
                        op: "authKeyExpires",
                        args: [item.apiKeyID, expires, signature],
                    }));

                    for (let subscribe of account.subscribes) {
                        account.socket.send(subscribe);
                    }
                });
            });

            account.socket.on('message', (data) => {
                // console.log(new Date(), item.id, data);
                data = JSON.parse(data);
                if (!!data.table) {
                    const table = data.table;
                    if (table === 'order') {
                        service.onWsOrder(data.action, data.data, account);
                    } else if (table === 'orderBookL2_25') {
                        service.onWsOrderBookL2_25(data.action, data.data, account);
                    } else if (table === 'position') {
                        service.onWsPosition(data.action, data.data, account);
                    }
                }
            });

            account.socket.on('reconnect', (data) => {
                console.warn('reconnect', account.id, data);
            });

            account.socket.on('destroyed', (data) => {
                console.warn('destroyed', account.id, data);
            });
            account.socket.start();
        }
    },

    initFromDb: (tableName, callback) => {
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

    wsOrderBookL2_25: (symbol) => {
        const query = JSON.stringify({
            op: 'subscribe',
            args: 'orderBookL2_25:' + symbol,
        });
        for (let account of service.accounts) {
            if (account.socket.isConnected) {
                account.socket.send(query);
            } else {
                account.subscribes.push(query);
            }
        }
    },

    wsExecution: (symbol) => {
        const query = JSON.stringify({
            op: 'subscribe',
            args: 'execution:' + symbol,
        });
        for (let account of service.accounts) {
            if (account.socket.isConnected) {
                account.socket.send(query);
            } else {
                account.subscribes.push(query);
            }
        }
    },

    wsOrder: (symbol) => {
        const query = JSON.stringify({
            op: 'subscribe',
            args: 'order:' + symbol,
        });
        for (let account of service.accounts) {
            if (account.socket.isConnected) {
                account.socket.send(query);
            } else {
                account.subscribes.push(query);
            }
        }
    },

    wsPosition: (symbol) => {
        const query = JSON.stringify({
            op: 'subscribe',
            args: 'position:' + symbol,
        });
        for (let account of service.accounts) {
            if (account.socket.isConnected) {
                account.socket.send(query);
            } else {
                account.subscribes.push(query);
            }
        }
    },

    onWsOrder: (action, data, account) => {
        console.log('onWsOrder', account.id, action, JSON.stringify(data));
        if (action === 'insert') {
            const rest = account.rest;
            rest.order(GET, {
                filter: {
                    orderID: data.orderID,
                }
            }, (data) => {
                console.log('onWsOrder', data);
            });
        }
    },

    onWsOrderBookL2_25: (action, data, account) => {
        console.log('onWsOrderBookL2_25', account.id, action, JSON.stringify(data));
    },

    onWsPosition: (action, data, account) => {
        console.log('onWsPosition', account.id, action, JSON.stringify(data));
    },
};
module.exports = {BitMEXService: service, GET, POST, PUT, DELETE};
