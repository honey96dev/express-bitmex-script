import dbConn from '../core/dbConn';
import BitMEXClient from 'bitmex-realtime-api';
import { BitmexRequest } from 'bitmex-request';
import sprintfJs from 'sprintf-js';

let service = {
    accounts: [],
    init: (configs) => {
        service.accounts = [];
        for (let item of configs) {
            service.accounts.push({
                id: item.id,
                socket: new BitMEXClient({
                    testnet: item.testnet == 1,
                    apiKeyID: item.apiKeyID,
                    apiKeySecret: item.apiKeySecret,
                    maxTableLen: item.maxTableLen
                }),
                rest: new BitmexRequest({
                    testnet: item.testnet == 1,
                    apiKey: item.apiKeyID,
                    apiSecret: item.apiKeySecret,
                    retryTimes: 2,
                }),
            });
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

    wsPosition: () => {
        for (let account of service.accounts) {
            account.socket.addStream('XBTUSD', 'orderBookL2_25', (data, symbol, tableName) => {
                if (data.length > 0) {
                    console.log(account.id, symbol, tableName, JSON.stringify(data));
                }
            });
        }
    },

    restOrderBookL2: async (bitmex) => {
        bitmex = service.accounts[0];
        let res = await bitmex.request('GET', '/orderBook/L2');
        console.log(res);
    },
};
module.exports = service;
