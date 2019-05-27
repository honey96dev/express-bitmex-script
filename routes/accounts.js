import express from 'express';
import config from '../core/config';
import dbConn from '../core/dbConn';
import sprintfJs from 'sprintf-js';
import bitmexAccounts from '../core/bitmexAccounts';

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
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
    res.render('accounts/index', {
        baseUrl: config.server.baseUrl,
        uri: 'accounts/index',
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

router.get('/list', (req, res, next) => {
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
        // let sql = sprintfJs.sprintf("SELECT * FROM `bitmex_accounts`;");
        //
        // dbConn.query(sql, null, (error, results, fields) => {
        //     if (error) {
        //         res.status(200).send({
        //             result: 'error',
        //             message: 'Unknown error',
        //             data: [],
        //         });
        //         return;
        //     } else {
        //         res.status(200).send({
        //             result: 'success',
        //             data: results,
        //         });
        //     }
        // });
    } else {
        res.redirect(404);
    }
});

router.post('/save', (req, res, next) => {
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
                        });
                    } else {
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

router.put('/save', (req, res, next) => {
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
            });
        } else {
            res.status(200).send({
                result: 'success',
                message: 'Successfully changed',
            });
        }
    });
    // let sql = sprintfJs.sprintf("", email, name, testnet, apiKeyID, apiKeySecret, isParent);
});

router.delete('/save', (req, res, next) => {
    const params = req.body;
    const accountId = params.accountId;

    let sql = sprintfJs.sprintf("DELETE FROM `bitmex_accounts` WHERE `id` = '%d';", accountId);
    dbConn.query(sql, null, (error, results, fields) => {
        if (error) {
            res.status(200).send({
                result: 'error',
                message: 'Unknown error',
            });
        } else {
            res.status(200).send({
                result: 'success',
                message: 'Successfully deleted',
            });
        }
    });
    // let sql = sprintfJs.sprintf("", email, name, testnet, apiKeyID, apiKeySecret, isParent);
});

module.exports = router;
