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
    console.log('rest-position', testnet, apiKeyID, apiKeySecret, filter);
    const bitmexApi = new BitMEXApi(testnet, apiKeyID, apiKeySecret);
    bitmexApi.order(GET, {filter: filter}, (data) => {
        res.status(200).send(data);
    }, (error) => {
        res.status(500).send(error);
    });
});

router.post('/order', function (req, res, next) {
    const headers = req.headers;
    const params = req.query;

    const testnet = Boolean(headers.testnet);
    const apiKeyID = headers.apikeyid;
    const apiKeySecret = headers.apikeysecret;
    const filter = params.filter;
    console.log('rest-position', testnet, apiKeyID, apiKeySecret, filter);
    const bitmexApi = new BitMEXApi(testnet, apiKeyID, apiKeySecret);
    bitmexApi.order(GET, {filter: filter}, (data) => {
        res.status(200).send(data);
    }, (error) => {
        res.status(500).send(error);
    });
});

router.get('/position', function (req, res, next) {
    // res.status(200).send(req.headers);return;
    const query = req.query;
    // const testnet = true;
    const testnet = Boolean(query.testnet);
    const apiKeyID = query.apiKeyID;
    const apiKeySecret = query.apiKeySecret;
    const filter = query.filter;
    console.log('rest-position', testnet, apiKeyID, apiKeySecret, filter);
    const bitmexApi = new BitMEXApi(testnet, apiKeyID, apiKeySecret);
    bitmexApi.position(GET, {filter: filter}, (data) => {
        res.status(200).send(data);
    }, (error) => {
        res.status(500).send(error);
    });
});

module.exports = router;
