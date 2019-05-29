import express from 'express';
import config from '../core/config';
import dbConn from '../core/dbConn';
import sprintfJs from 'sprintf-js';
import bitmexAccounts from '../core/bitmexAccounts';
import SocketIOServerService from '../services/socketIOServerService';

const router = express.Router();

/* GET home page. */
router.get('/bitmex', function (req, res, next) {
    const styles = [
        // 'vendors/general/jquery-datatable/css/jquery.dataTables.css',
        'vendors/general/material-design-lite/material.css',
        'vendors/general/jquery-datatable/css/dataTables.material.css',
        'stylesheets/site/accounts.css',
    ];
    const scripts = [
        'vendors/general/jquery-datatable/js/jquery.dataTables.js',
        'vendors/general/jquery-datatable/js/dataTables.bootstrap4.js',
        'vendors/general/socket.io/socket.io.js',
        'javascripts/site/accounts.js',
    ];

    // bitmexAccounts.accountList((data) => {
    res.render('accounts/bitmex', {
        baseUrl: config.server.baseUrl,
        uri: 'accounts/bitmex',
        styles: styles,
        scripts: scripts,
        // bitmexAccounts: data,
    });
    // }, (error) => {
    //     res.render('accounts/index', {
    //         baseUrl: config.server.baseUrl,
    //         uri: 'accounts/index',
    //         styles: styles,
    //         scripts: scripts,
    //         bitmexAccounts: [],
    //     });
    // });
    // res.render('index/index', {baseUrl: config.server.baseUrl});
});

router.get('/bitmex/list', (req, res, next) => {
    if (req.xhr) {
        bitmexAccounts.accountList((data) => {
            res.status(200).send({
                result: 'error',
                data: data,
            });
        }, (error) => {
            res.status(200).send({
                result: 'error',
                message: 'Unknown error',
                data: [],
            });
        });
    } else {
        res.redirect(404);
    }
});

router.post('/bitmex/save', (req, res, next) => {
    const params = req.body;
    const email = params.email;
    const name = params.name;
    const testnet = params.testnet;
    const apiKeyID = params.apiKeyID;
    const apiKeySecret = params.apiKeySecret;
    const isParent = params.isParent;
    // const email = params.email;

    let sql = sprintfJs.sprintf("SELECT COUNT(`email`) `count` FROM `bitmex_accounts` WHERE BINARY `email` = '%s';", email);
    dbConn.query(sql, null, (error, results, fields) => {
        if (error) {
            res.status(200).send({
                result: 'error',
                message: 'Unknown error',
                error: error,
            });
        } else {
            if (parseInt(results[0].count) > 0) {
                res.status(200).send({
                    result: 'error',
                    message: 'This email is already registered!',
                });
            } else {
                sql = sprintfJs.sprintf("INSERT INTO `bitmex_accounts`(`email`, `name`, `testnet`, `apiKeyID`, `apiKeySecret`, `isParent`) VALUES('%s', '%s', '%d', '%s', '%s', '%d');", email, name, !!testnet ? 1 : 0, apiKeyID, apiKeySecret, !!isParent ? 1 : 0);
                dbConn.query(sql, null, (error1, results1, fields) => {
                    if (error) {
                        res.status(200).send({
                            result: 'error',
                            message: 'Unknown error',
                            error: error,
                        });
                    } else {
                        SocketIOServerService.remakeAllSockets();
                        res.status(200).send({
                            result: 'success',
                            message: 'Successfully registered',
                            data: results1,
                        });
                    }
                });
            }

        }
    });
    // let sql = sprintfJs.sprintf("", email, name, testnet, apiKeyID, apiKeySecret, isParent);
});

router.put('/bitmex/save', (req, res, next) => {
    const params = req.body;
    const accountId = params.accountId;
    const email = params.email;
    const name = params.name;
    const testnet = params.testnet;
    const apiKeyID = params.apiKeyID;
    const apiKeySecret = params.apiKeySecret;
    const isParent = params.isParent;
    // const email = params.email;

    let sql = sprintfJs.sprintf("UPDATE `bitmex_accounts` SET `email` = '%s', `name` = '%s', `testnet` = '%d', `apiKeyID` = '%s', `apiKeySecret` = '%s', `isParent` = '%d' WHERE BINARY `id` = '%d';", email, name, !!testnet ? 1 : 0, apiKeyID, apiKeySecret, !!isParent ? 1 : 0, accountId);
    dbConn.query(sql, null, (error, results, fields) => {
        if (error) {
            res.status(200).send({
                result: 'error',
                message: 'Unknown error',
                error: error,
            });
        } else {
            SocketIOServerService.remakeAllSockets();
            res.status(200).send({
                result: 'success',
                message: 'Successfully changed',
            });
        }
    });
    // let sql = sprintfJs.sprintf("", email, name, testnet, apiKeyID, apiKeySecret, isParent);
});

router.delete('/bitmex/save', (req, res, next) => {
    const params = req.body;
    const accountId = params.accountId;

    let sql = sprintfJs.sprintf("DELETE FROM `bitmex_accounts` WHERE `id` = '%d';", accountId);
    dbConn.query(sql, null, (error, results, fields) => {
        if (error) {
            res.status(200).send({
                result: 'error',
                message: 'Unknown error',
                error: error,
            });
        } else {
            SocketIOServerService.remakeAllSockets();
            res.status(200).send({
                result: 'success',
                message: 'Successfully deleted',
            });
        }
    });
    // let sql = sprintfJs.sprintf("", email, name, testnet, apiKeyID, apiKeySecret, isParent);
});


router.get('/wallet', function (req, res, next) {
    const styles = [
        // 'vendors/general/jquery-datatable/css/jquery.dataTables.css',
        'vendors/general/material-design-lite/material.css',
        'vendors/general/jquery-datatable/css/dataTables.material.css',
        'stylesheets/site/wallet.css',
    ];
    const scripts = [
        'vendors/general/jquery-datatable/js/jquery.dataTables.js',
        'vendors/general/jquery-datatable/js/dataTables.bootstrap4.js',
        'vendors/general/socket.io/socket.io.js',
        'javascripts/site/wallet.js',
    ];

    bitmexAccounts.accountList((data) => {
        res.render('accounts/wallet', {
            baseUrl: config.server.baseUrl,
            uri: 'accounts/wallet',
            styles: styles,
            scripts: scripts,
            bitmexAccounts: data,
        });
    }, (error) => {
        res.render('accounts/wallet', {
            baseUrl: config.server.baseUrl,
            uri: 'accounts/wallet',
            styles: styles,
            scripts: scripts,
            bitmexAccounts: [],
        });
    });

    // res.render('dashboard/index', {baseUrl: config.server.baseUrl});
});


/* GET home page. */
router.get('/users', function (req, res, next) {
    const styles = [
        // 'vendors/general/jquery-datatable/css/jquery.dataTables.css',
        'vendors/general/material-design-lite/material.css',
        'vendors/general/jquery-datatable/css/dataTables.material.css',
        'stylesheets/site/users.css',
    ];
    const scripts = [
        'vendors/general/jquery-datatable/js/jquery.dataTables.js',
        'vendors/general/jquery-datatable/js/dataTables.bootstrap4.js',
        'vendors/general/socket.io/socket.io.js',
        'javascripts/site/users.js',
    ];

    res.render('accounts/users', {
        baseUrl: config.server.baseUrl,
        uri: 'accounts/users',
        styles: styles,
        scripts: scripts,
        // bitmexAccounts: data,
    });
});

router.get('/users/list', (req, res, next) => {
    let sql = sprintfJs.sprintf("SELECT * FROM `users`;");

    dbConn.query(sql, null, (error, results, fields) => {
        if (error) {
            res.status(200).send({
                result: 'error',
                message: 'Unknown error',
                data: [],
            });
            return;
        } else {
            res.status(200).send({
                result: 'success',
                data: results,
            });
        }
    });
});

router.delete('/users/save', (req, res, next) => {
    const params = req.body;
    const accountId = params.accountId;

    let sql = sprintfJs.sprintf("DELETE FROM `users` WHERE `id` = '%d';", accountId);
    dbConn.query(sql, null, (error, results, fields) => {
        if (error) {
            res.status(200).send({
                result: 'error',
                message: 'Unknown error',
                error: error,
            });
        } else {
            SocketIOServerService.remakeAllSockets();
            res.status(200).send({
                result: 'success',
                message: 'Successfully deleted',
            });
        }
    });
    // let sql = sprintfJs.sprintf("", email, name, testnet, apiKeyID, apiKeySecret, isParent);
});

module.exports = router;
