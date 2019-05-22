// import { BitmexRequest } from 'bitmex-request';
//
// function BitMEXApi(testnet, apiKeyID, apiKeySecret, retryTimes) {
//     this.apiKeyID = apiKeyID;
//     this.apiKeySecret = apiKeySecret;
//     this.bitmex = new BitmexRequest({
//         testnet: testnet,
//         apiKey: apiKeyID,
//         apiSecret: apiKeySecret,
//         retryTimes: retryTimes,
//     });
//
//     this.orderBookL2 = () => {
//         // console.log(this);
//         let res = this.bitmex.request('GET', '/orderBook/L2');
//         console.log('res', res);
//         // .then((a, b, c, d) => {
//         //     console.log('a', a);
//         //     console.log('b', b);
//         //     console.log('c', c);
//         //     console.log('d', d);
//         // });
//
//     }
// }
// // BitMEXApi.prototype = {
// //     init: () => {
// //
// //     },
// //
// //     getTimestamp: () => {
// //
// //     },
// //
// //     generateSign: (verb, path, data) => {
// //
// //     },
// //
// //     orderBookL2: () => {
// //         console.log(this);
// //         // this.bitmex.request('GET', '/orderBook/L2').then((a, b, c, d) => {
// //         //     console.log('a', a);
// //         //     console.log('b', b);
// //         //     console.log('c', c);
// //         //     console.log('d', d);
// //         // });
// //
// //     },
// // };
//
// module.exports = BitMEXApi;
