module.exports = {
    server: {
        port: 3030,
        baseUrl: 'http://127.0.0.1:3030/',
        name: 'Bitmex-script',
    },
    mysql: {
        connectionLimit: 10,
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'bitmex_script',
        port: 3306
    },
    session: {
        secret: 'bitmex_script@@'
    },
    bitmex: {
        table: 'bitmex_accounts',
        testnet: true,
        apiKeyID: 'O6VAhGlVAqaBjiigboCgBtvN',
        apiKeySecret: 'XeJ5AYnEEf_e4JJxBd5uQcRiJlyIUpuKY4Wi2Bzkl75H0OME',
        maxTableLen: 100,
        // bucketedUrl: 'https://www.bitmex.com/api/v1/trade/bucketed?binSize=5m&partial=false&symbol=XBTUSD&count=500&reverse=false&startTime='
    },
};
