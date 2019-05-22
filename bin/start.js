import app from '../app';
import debugLib from 'debug';
import http from 'http';
import cluster from 'cluster';
import config from '../core/config';
import bitmexService from '../services/bitmexService';
// import BitMEXApi from '../core/bitmexApi';

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

    bitmexService.initFromDb(config.bitmex.table, bitmexService.restOrderBookL2);
    // let bitmex = new BitMEXApi(
    //     config.bitmex.testnet,
    //     config.bitmex.apiKeyID,
    //     config.bitmex.apiKeySecret,
    //     config.bitmex.maxTableLen,
    // );
    // bitmex.orderBookL2();
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
