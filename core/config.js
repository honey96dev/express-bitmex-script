module.exports = {
    server: {
        port: 3000,
        baseUrl: 'http://127.0.0.1:3000/',
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
        apiKeyID: 'TlzFBawLjbedHIa-hbxkqiPS',
        apiKeySecret: 'CxtuNEE2sUDvPcWfa8TSu_6NQcye13UxKtGF-NExKZttWGto',
        maxTableLen: 100,
        // bucketedUrl: 'https://www.bitmex.com/api/v1/trade/bucketed?binSize=5m&partial=false&symbol=XBTUSD&count=500&reverse=false&startTime='
    },
};
