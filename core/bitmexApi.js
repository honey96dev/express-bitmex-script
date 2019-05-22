import { BitmexRequest } from 'bitmex-request';
// import request from 'request';
// import sprintfJs from 'sprintf-js';
// import crypto from 'crypto';
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';

function BitMEXApi(testnet, apiKeyID, apiKeySecret, retryTimes) {
    this.testnet = testnet;
    this.apiKeyID = apiKeyID;
    this.apiKeySecret = apiKeySecret;
    this.retryTimes = retryTimes;
    this.bitmex = new BitmexRequest({
        testnet: testnet,
        apiKey: apiKeyID,
        apiSecret: apiKeySecret,
        retryTimes: retryTimes,
    });

    const urlOrderBookL2 = '/orderBook/L2';
    const urlPosition = '/position';
    const urlTradeBucketed = '/trade/bucketed';

    // this.baseUrl = testnet ? 'https://testnet.bitmex.com/api/v1' : 'https://www.bitmex.com/api/v1';
    //
    //
    //
    // this.getTimestamp = (callback) => {
    //     let url = sprintfJs.sprintf('%s', this.baseUrl);
    //     request(url, (error, response, body) => {
    //         if (!response || response.statusCode !== 200) {
    //             return;
    //         }
    //         const result = JSON.parse(body);
    //
    //         if (callback) {
    //             callback(result);
    //         }
    //     });
    // };
    //
    // this.generateSign = (method, path, expires, postBody) => {
    //     method = method.toUpperCase();
    //     if (postBody === undefined) {
    //         postBody = '';
    //     }
    //     const plain = sprintfJs.sprintf('%s%s%d%s', method, path, expires, postBody);
    //     // const plain = 'GET/api/v1/instrument?filter=%7B%22symbol%22%3A+%22XBTM15%22%7D1518064237';
    //     const signature = crypto
    //         // .createHmac('sha256', 'chNOOS4KvNXR_Xq4k4c9qsfoKWvnDecLATCRlcBwyKDYnWgO')
    //         .createHmac('sha256', this.apiKeySecret)
    //         .update(plain)
    //         .digest('hex');
    //     console.log('sign', plain, signature);
    //     return signature;
    // };

    this.orderBookL2 = (data, callback) => {
        // // console.log(this);
        this.bitmex.request(GET, urlOrderBookL2, data, false, 2)
            .then((result) => {
            console.log('orderBookL2', JSON.stringify(result));
            if (callback) {
                callback(result);
            }
        }, (error) => {
            console.warn('error', error);
        });
        // this.bitmex.getAllActiveOrders('*').then((a, b, c, d) => {
        //     console.log('a', a);
        //     console.log('b', b);
        //     console.log('c', c);
        //     console.log('d', d);
        // }, (a, b, c, d) => {
        //     console.warn('a', a);
        //     console.warn('b', b);
        //     console.warn('c', c);
        //     console.warn('d', d);
        // });
        // this.getTimestamp((result) => {
        //     const expires = parseInt(result.timestamp / 1000 + 5);
        //     // const urlOrderBookL2 = '/api/v1/instrument?filter=%7B%22symbol%22%3A+%22XBTM15%22%7D';
        //     // const signature = this.generateSign(GET, urlOrderBookL2, 1518064237 );
        //     const signature = this.generateSign(GET, urlOrderBookL2, expires);
        //     let url = sprintfJs.sprintf('%s%s', this.baseUrl, urlOrderBookL2);
        //     const options = {
        //         url: url,
        //         headers: {
        //             'api-expires': expires,
        //             'api-key': this.apiKeyID,
        //             'api-signature': signature,
        //         },
        //         // set forever to true in order to keep alive, this could achive lower latency
        //         forever: true,
        //         GET,
        //         body: undefined,
        //     };
        //     console.log('options', options);
        //     request(options, (error, response, body) => {
        //         console.log('result', error, body);
        //         if (!response || response.statusCode !== 200) {
        //             return;
        //         }
        //         const result = JSON.parse(body);
        //
        //         if (callback) {
        //             callback(result);
        //         }
        //     });
        // });
    };
    this.position = (method, data, callback) => {
        console.log('position');
        method = method.toUpperCase();
        this.bitmex.request(method, urlPosition, data, false, 2)
            .then((result) => {
                console.log('tradeBucketed', JSON.stringify(result));
                if (callback) {
                    callback(result);
                }
            }, (error) => {
                console.warn('error', error);
            });
    };

    this.tradeBucketed = (data, callback) => {
        // console.log(this);
        this.bitmex.request(GET, urlTradeBucketed, data, false, 2)
            .then((result) => {
                console.log('tradeBucketed', JSON.stringify(result));
                if (callback) {
                    callback(result);
                }
            }, (error) => {
                console.warn('error', error);
            });
    };
}

module.exports = {BitMEXApi, GET, POST, PUT, DELETE};
