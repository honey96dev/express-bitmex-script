import dbConn from '../core/dbConn';
import sprintfJs from 'sprintf-js';
import WebSocket from 'ws-reconnect';
import ioCliect from 'socket.io-client';
import request from 'request';
import crypto from 'crypto'
import {BitMEXApi, DELETE, GET, POST, PUT} from '../core/BitmexApi';
import _ from "lodash";

let service = {
    accounts: [],

    signMessage: (secret, verb, url, nonce, data) => {
        if (!data || _.isEmpty(data)) data = '';
        else if (_.isObject(data)) data = JSON.stringify(data);

        return crypto.createHmac('sha256', secret).update(verb + url + nonce + data).digest('hex');
    },

    renewSocket: (account) => {
        console.warn('renewSocket', account.id);
        const timestamp = new Date().getTime();
        if (account.renewSocketTimeoutId) {
            clearTimeout(account.renewSocketTimeoutId);
        }
        account.renewSocketTimeoutId = setTimeout(service.renewSocket, 30000, account);
        if (account.lastTimestamp > timestamp - 30000) {
            console.warn('renewSocket-still alive', account.id);
            return;
        }
        let socket = new WebSocket(Boolean(account.testnet) ? 'wss://testnet.bitmex.com/realtime' : 'wss://www.bitmex.com/realtime', {
            retryCount: 2, // default is 2
            reconnectInterval: 1 // default is 5
        });

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
            // const url = item.testnet ? 'https://testnet.bitmex.com/api/v1' : 'https://www.bitmex.com/api/v1';
            //
            // request(url, (error, response, body) => {
            //     if (!response || response.statusCode !== 200) {
            //         return;
            //     }
            //     const result = JSON.parse(body);
            //
            //
            // });
        });

        socket.on('message', (data) => {
            // const timestamp = new Date().getTime();
            account.lastTimestamp = new Date().getTime();
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

        socket.on('reconnect', (data) => {
            console.warn('reconnect', account.id, data);
            // account.socket.start();
        });

        socket.on('destroyed', (data) => {
            console.warn('destroyed', account.id, data);
        });

        if (account.isParent) {
            socket.start();
        } else {
            if (!!account.socket && account.socket.isConnected) {
                account.socket.destroy();
                // delete account.socket;
            }
            account.socket = socket;
        }

        // account.renewSocketTimeoutId = setTimeout(service.renewSocket, 30000, account);
    },
    //
    // init: (configs) => {
    //     service.accounts = [];
    //     for (let item of configs) {
    //         let account = {
    //             id: item.id,
    //             isParent: Boolean(item.isParent),
    //             rest: new BitMEXApi(Boolean(item.testnet), item.apiKeyID, item.apiKeySecret),
    //             socket: undefined,
    //             subscribes: [],
    //             testnet: Boolean(item.testnet),
    //             apiKeyID: item.apiKeyID,
    //             apiKeySecret: item.apiKeySecret,
    //         };
    //
    //         account.socket = new WebSocket(Boolean(item.testnet) ? 'wss://testnet.bitmex.com/realtime' : 'wss://www.bitmex.com/realtime', {
    //             retryCount: 10, // default is 2
    //             reconnectInterval: 1 // default is 5
    //         });
    //
    //         account.socket.on('connect', () => {
    //             account.rest.getTimestamp((result) => {
    //                 const expires = parseInt(result / 1000 + 5);
    //                 const signature = service.signMessage(item.apiKeySecret, 'GET', '/realtime', expires);
    //
    //                 account.socket.send(JSON.stringify({
    //                     op: "authKeyExpires",
    //                     args: [item.apiKeyID, expires, signature],
    //                 }));
    //
    //                 for (let subscribe of account.subscribes) {
    //                     account.socket.send(subscribe);
    //                 }
    //             });
    //             // const url = item.testnet ? 'https://testnet.bitmex.com/api/v1' : 'https://www.bitmex.com/api/v1';
    //             //
    //             // request(url, (error, response, body) => {
    //             //     if (!response || response.statusCode !== 200) {
    //             //         return;
    //             //     }
    //             //     const result = JSON.parse(body);
    //             //
    //             //
    //             // });
    //         });
    //
    //         account.socket.on('message', (data) => {
    //             data = JSON.parse(data);
    //             if (!!data.table) {
    //                 const table = data.table;
    //                 if (table === 'order') {
    //                     service.onWsOrder(data.action, data.data, account);
    //                 } else if (table === 'orderBookL2_25') {
    //                     service.onWsOrderBookL2_25(data.action, data.data, account);
    //                 } else if (table === 'position') {
    //                     service.onWsPosition(data.action, data.data, account);
    //                 }
    //             }
    //         });
    //
    //         account.socket.on('reconnect', (data) => {
    //             console.warn('reconnect', account.id, data);
    //             // account.socket.start();
    //         });
    //
    //         account.socket.on('destroyed', (data) => {
    //             console.warn('destroyed', account.id, data);
    //         });
    //
    //         service.accounts.push(account);
    //         if (account.isParent) {
    //             account.socket.start();
    //         }
    //     }
    // },
    //
    init: (configs) => {
        service.accounts = [];
        for (let item of configs) {
            let account = {
                id: item.id,
                isParent: Boolean(item.isParent),
                rest: new BitMEXApi(Boolean(item.testnet), item.apiKeyID, item.apiKeySecret),
                socket: undefined,
                subscribes: [],
                testnet: Boolean(item.testnet),
                apiKeyID: item.apiKeyID,
                apiKeySecret: item.apiKeySecret,
                lastTimestamp: 0,
            };

            service.accounts.push(account);

            account.renewSocketTimeoutId = setTimeout(service.renewSocket, 0, account);
            //
            // account.socket = new WebSocket(Boolean(item.testnet) ? 'wss://testnet.bitmex.com/realtime' : 'wss://www.bitmex.com/realtime', {
            //     retryCount: 10, // default is 2
            //     reconnectInterval: 1 // default is 5
            // });
            //
            // account.socket.on('connect', () => {
            //     account.rest.getTimestamp((result) => {
            //         const expires = parseInt(result / 1000 + 5);
            //         const signature = service.signMessage(item.apiKeySecret, 'GET', '/realtime', expires);
            //
            //         account.socket.send(JSON.stringify({
            //             op: "authKeyExpires",
            //             args: [item.apiKeyID, expires, signature],
            //         }));
            //
            //         for (let subscribe of account.subscribes) {
            //             account.socket.send(subscribe);
            //         }
            //     });
            //     // const url = item.testnet ? 'https://testnet.bitmex.com/api/v1' : 'https://www.bitmex.com/api/v1';
            //     //
            //     // request(url, (error, response, body) => {
            //     //     if (!response || response.statusCode !== 200) {
            //     //         return;
            //     //     }
            //     //     const result = JSON.parse(body);
            //     //
            //     //
            //     // });
            // });
            //
            //
            // account.socket.on('message', (data) => {
            //     data = JSON.parse(data);
            //     if (!!data.table) {
            //         const table = data.table;
            //         if (table === 'order') {
            //             service.onWsOrder(data.action, data.data, account);
            //         } else if (table === 'orderBookL2_25') {
            //             service.onWsOrderBookL2_25(data.action, data.data, account);
            //         } else if (table === 'position') {
            //             service.onWsPosition(data.action, data.data, account);
            //         }
            //     }
            // });
            //
            // account.socket.on('reconnect', (data) => {
            //     console.warn('reconnect', account.id, data);
            //     // account.socket.start();
            // });
            //
            // account.socket.on('destroyed', (data) => {
            //     console.warn('destroyed', account.id, data);
            // });
            //
            // if (account.isParent) {
            //     account.socket.start();
            // }
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
            if (!!account.socket && account.socket.isConnected) {
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
            if (!!account.socket && account.socket.isConnected) {
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
            if (!!account.socket && account.socket.isConnected) {
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
            if (!!account.socket && account.socket.isConnected) {
                account.socket.send(query);
            } else {
                account.subscribes.push(query);
            }
        }
    },


    onWsOrder: (action, data, account) => {
        console.log('onWsOrder', new Date(), account.id, action, JSON.stringify(data));
        if (action === 'insert') {
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
                            url: 'http://127.0.0.1:3000/rest/order',
                            method: POST,
                            body: body
                        };
                        request(requestOptions);
                    }
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
                                url: 'http://127.0.0.1:3000/rest/order',
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
                                url: 'http://127.0.0.1:3000/rest/order',
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
                                url: 'http://127.0.0.1:3000/rest/order',
                                method: PUT,
                                body: body
                            };
                            request(requestOptions);
                        } else if (typeof item.pegOffsetValue !== 'undefined') {
                            body = {
                                orderID: item.orderID,
                                pegOffsetValue: item.pegOffsetValue,
                                isClone: true,
                            };
                            if (!body || _.isEmpty(body)) body = '';
                            else if (_.isObject(body)) body = JSON.stringify(body);
                            console.log('clone to', account1.id, body);

                            const requestOptions = {
                                headers: headers,
                                url: 'http://127.0.0.1:3000/rest/order',
                                method: PUT,
                                body: body
                            };
                            request(requestOptions);
                        }
                    }
                }
            }
        }
    },

    onWsOrderBookL2_25: (action, data, account) => {
        // console.log('onWsOrderBookL2_25', account.id, action, JSON.stringify(data));
    },

    onWsPosition: (action, data, account) => {
        console.log('onWsPosition', new Date(), account.id, action, JSON.stringify(data));
        if (action === 'insert') {

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
                                url: 'http://127.0.0.1:3000/rest/positionLeverage',
                                method: POST,
                                body: body
                            };
                            request(requestOptions);
                        }
                    }
                }
            }
        }
    },
};
module.exports = {BitMEXService: service, GET, POST, PUT, DELETE};
