import debugLib from 'debug';
import cluster from 'cluster';
import config from '../core/config';
import {BitMEXService} from '../services/bitmexService';

if (cluster.isMaster) {
    cluster.fork();
    cluster.on('exit', function (worker, code, signal) {
        cluster.fork();
    });
}

let debug;
if (cluster.isWorker) {
    debug = new debugLib('project:socket');

    BitMEXService.initFromDb(config.bitmex.table, () => {
        BitMEXService.wsOrderBookL2_25('*');
        BitMEXService.wsOrder('*');
        BitMEXService.wsExecution('*');
        BitMEXService.wsPosition('*');
        // BitMEXService.restPosition(GET, {}, (data) => {
        //     console.log('restPosition', JSON.stringify(data));
        // }, (error) => {
        //     console.warn('restPosition', JSON.stringify(error));
        // });
    });
}
