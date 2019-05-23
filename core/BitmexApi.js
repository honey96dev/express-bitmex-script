import request from "request";
import crypto from 'crypto';
import _ from 'lodash';
import debugLib from 'debug';

const debug = new debugLib('bitmex:rest');

const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';

function BitmexApi(testnet, apiKeyID, apiKeySecret) {
    this.testnet = testnet;
    this.apiKeyID = apiKeyID;
    this.apiKeySecret = apiKeySecret;

    const baseUrl = this.testnet ? 'https://testnet.bitmex.com' : 'https://www.bitmex.com';
    const apiVersion = '/api/v1';
    const baseApiPath = baseUrl + apiVersion;
    const urlOrder = '/order';
    const urlOrderAll = '/order/all';
    const urlOrderBulk = '/order/bulk';
    const urlOrderCancelAllAfter = '/order/cancelAllAfter';
    const urlOrderClosePosition = '/order/closePosition';
    const urlOrderBookL2 = '/orderBook/L2';
    const urlPosition = '/position';
    const urlTradeBucketed = '/trade/bucketed';

    this.signMessage = (secret, verb, url, nonce, data) => {
        if (!data || _.isEmpty(data)) data = '';
        else if (_.isObject(data)) data = JSON.stringify(data);
        const plain = verb + url + nonce + data;
        const cipher = crypto.createHmac('sha256', secret).update(plain).digest('hex');
        // console.log('signMessage', plain, cipher);
        return cipher;
    };

    this.getTimestamp = (onFulfilled, onRejected) => {
        request(baseApiPath, (error, response, body) => {
            if (!response || response.statusCode !== 200) {
                if (typeof onRejected === 'function') onRejected(error);
                return;
            }

            const result = JSON.parse(body);
            if (typeof onFulfilled === 'function') onFulfilled(result.timestamp);
        });
    };

    this.request = (method, path, data, requireAuthentication, onFulfilled, onRejected) => {
        debug('request-begin');
        method = method.toUpperCase();
        if (requireAuthentication) {
            this.getTimestamp((result) => {
                const expires = parseInt(result / 1000 + 5);
                const signature = this.signMessage(this.apiKeySecret, method, apiVersion + path, expires, data);
                const headers = {
                    'content-type' : 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'api-expires': expires,
                    'api-key': this.apiKeyID,
                    'api-signature': signature,
                };

                debug('signature', method, path, expires, signature);

                if (!data || _.isEmpty(data)) data = '';
                else if (_.isObject(data)) data = JSON.stringify(data);

                const requestOptions = {
                    headers: headers,
                    url: baseApiPath+path,
                    method: method,
                    body: data,
                };

                request(requestOptions, function (error, response, body) {
                    if (error || response.statusCode !== 200) {
                        console.warn('request', error);
                        if (typeof onRejected === 'function') {
                            onRejected(error);
                        }
                        return;
                    }
                    debug('success', body);
                    const result = JSON.parse(body);
                    if (typeof onFulfilled === 'function') {
                        onFulfilled(result);
                    }
                });
            });
        } else {
            const headers = {
                'content-type' : 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            };

            if (!data || _.isEmpty(data)) data = '';
            else if (_.isObject(data)) data = JSON.stringify(data);

            const requestOptions = {
                headers: headers,
                url: baseApiPath+path,
                method: method,
                body: data
            };

            request(requestOptions, function (error, response, body) {
                if (error || response.statusCode !== 200) {
                    console.warn('request', error);
                    if (typeof onRejected === 'function') {
                        onRejected(error);
                    }
                    return;
                }
                debug('success', body);
                const result = JSON.parse(body);
                if (typeof onFulfilled === 'function') {
                    onFulfilled(result);
                }
            });
        }
    };

    this.order = (method, data, onFulfilled, onRejected) => {
        this.request(method, urlOrder, data, true, onFulfilled, onRejected);
    };

    this.orderAll = (data, onFulfilled, onRejected) => {
        this.request(DELETE, urlOrderAll, data, true, onFulfilled, onRejected);
    };

    this.orderBulk = (method, data, onFulfilled, onRejected) => {
        this.request(method, urlOrderBulk, data, true, onFulfilled, onRejected);
    };

    this.orderCancelAllAfter = (data, onFulfilled, onRejected) => {
        this.request(POST, urlOrderCancelAllAfter, data, true, onFulfilled, onRejected);
    };

    this.orderClosePosition = (data, onFulfilled, onRejected) => {
        this.request(POST, urlOrderClosePosition, data, true, onFulfilled, onRejected);
    };

    this.orderBookL2 = (data, onFulfilled, onRejected) => {
        this.request(GET, urlOrderBookL2, data, false, onFulfilled, onRejected);
    };

    this.position = (method, data, onFulfilled, onRejected) => {
        this.request(method, urlPosition, data, true, onFulfilled, onRejected);
    };

    this.tradeBucketed = (data, onFulfilled, onRejected) => {
        this.request(GET, urlTradeBucketed, data, false, onFulfilled, onRejected);
    };
}

module.exports = {BitMEXApi: BitmexApi, GET, POST, PUT, DELETE};
