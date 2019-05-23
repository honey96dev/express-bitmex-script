import app from '../app';
import debugLib from 'debug';
import http from 'http';
import cluster from 'cluster';
import config from '../core/config';
import {BitMEXService, GET, POST, PUT, DELETE} from '../services/bitmexService';
import request from 'request';
import _ from "lodash";

if (cluster.isMaster) {
    cluster.fork();
    cluster.on('exit', function (worker, code, signal) {
        cluster.fork();
    });
}

let debug;
let server;
if (cluster.isWorker) {
    debug = new debugLib('project:server');

    const port = normalizePort(process.env.PORT || config.server.port);
    app.set('port', port);

    server = http.createServer(app);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    // BitMEXService.initFromDb(config.bitmex.table, () => {
    //     BitMEXService.wsOrderBookL2_25('*');
    //     BitMEXService.wsOrder('*');
    //     BitMEXService.wsExecution('*');
    //     BitMEXService.wsPosition('*');
    //     // BitMEXService.restPosition(GET, {}, (data) => {
    //     //     console.log('restPosition', JSON.stringify(data));
    //     // }, (error) => {
    //     //     console.warn('restPosition', JSON.stringify(error));
    //     // });
    // });
    // let bitmexApi = new BitMEXApi(config.bitmex.testnet, config.bitmex.apiKeyID, config.bitmex.apiKeySecret);
    // bitmexApi.order(POST, )


    const headers = {
        'content-type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'testnet': config.bitmex.testnet,
        'apikeyid': config.bitmex.apiKeyID,
        'apikeysecret': config.bitmex.apiKeySecret,
    };

    let data = {
        order: {
            "orderID": "53ecab30-83aa-bf7a-d85b-cbe355f280e3",
            "clOrdID": "",
            "clOrdLinkID": "",
            "account": 204690,
            "symbol": "XBTUSD",
            "side": "Buy",
            "simpleOrderQty": null,
            "orderQty": 1,
            "price": 7718.5,
            "displayQty": null,
            "stopPx": null,
            "pegOffsetValue": null,
            "pegPriceType": "",
            "currency": "USD",
            "settlCurrency": "XBt",
            "ordType": "Limit",
            "timeInForce": "GoodTillCancel",
            "execInst": "",
            "contingencyType": "",
            "exDestination": "XBME",
            "ordStatus": "New",
            "triggered": "",
            "workingIndicator": false,
            "ordRejReason": "",
            "simpleLeavesQty": null,
            "leavesQty": 1,
            "simpleCumQty": null,
            "cumQty": 0,
            "avgPx": null,
            "multiLegReportingType": "SingleSecurity",
            "text": "Submission from testnet.bitmex.com",
            "transactTime": "2019-05-23T15:41:05.196Z",
            "timestamp": "2019-05-23T15:41:05.196Z"
        }
    };

    if (!data || _.isEmpty(data)) data = '';
    else if (_.isObject(data)) data = JSON.stringify(data);

    const requestOptions = {
        headers: headers,
        url: 'http://127.0.0.1:3000/rest/order',
        method: POST,
        body: data
    };
    // request(requestOptions);
}

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
