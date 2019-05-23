import express from 'express';
import {BitMEXApi, GET, POST, PUT, DELETE} from '../core/BitmexApi';

const router = express.Router();

router.get('/order', function (req, res, next) {
    const headers = req.headers;
    const params = req.query;

    const testnet = Boolean(headers.testnet);
    const apiKeyID = headers.apikeyid;
    const apiKeySecret = headers.apikeysecret;
    const filter = params.filter;
    console.log('rest-order post', testnet, apiKeyID, apiKeySecret, filter);
    const bitmexApi = new BitMEXApi(testnet, apiKeyID, apiKeySecret);
    bitmexApi.order(GET, {filter: filter}, (data) => {
        res.status(200).send(data);
    }, (error) => {
        res.status(500).send(error);
    });
});

router.post('/order', function (req, res, next) {
    const headers = req.headers;
    const params = req.body;

    const testnet = Boolean(headers.testnet);
    const apiKeyID = headers.apikeyid;
    const apiKeySecret = headers.apikeysecret;
    const order = params.order;
    console.log('rest-order post', testnet, apiKeyID, apiKeySecret, JSON.stringify(order));

    const bitmexApi = new BitMEXApi(testnet, apiKeyID, apiKeySecret);

    let data = {
        "symbol": order.symbol,
        "side": order.side,
        "simpleOrderQty": order.simpleOrderQty,
        "orderQty": order.orderQty,
        "price": order.price,
        "displayQty": order.displayQty,
        "stopPx": order.stopPx,
        "clOrdID": order.clOrdID,
        "clOrdLinkID": order.clOrdLinkID,
        "pegOffsetValue": order.pegOffsetValue,
        "pegPriceType": order.pegPriceType,
        "ordType": order.ordType,
        "timeInForce": order.timeInForce,
        "execInst": order.execInst,
        "contingencyType": order.contingencyType,
        "text": order.text,
    };
    bitmexApi.order(POST, data, (data) => {
        res.status(200).send(data);
    }, (error) => {
        res.status(500).send(error);
    });
});

router.get('/position', function (req, res, next) {
    const headers = req.headers;
    const params = req.query;

    const testnet = Boolean(headers.testnet);
    const apiKeyID = headers.apikeyid;
    const apiKeySecret = headers.apikeysecret;

    console.log('rest-position get', testnet, apiKeyID, apiKeySecret, filter);
    const bitmexApi = new BitMEXApi(testnet, apiKeyID, apiKeySecret);
    bitmexApi.position(GET, {filter: filter}, (data) => {
        res.status(200).send(data);
    }, (error) => {
        res.status(500).send(error);
    });
});

module.exports = router;
