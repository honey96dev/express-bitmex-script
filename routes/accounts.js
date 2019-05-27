import express from 'express';
import config from '../core/config';
import dbConn from '../core/dbConn';
import sprintfJs from 'sprintf-js';
import bitmexAccounts from '../core/bitmexAccounts';

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index/index', {
        baseUrl: config.server.baseUrl,
        styles: [
            // 'vendors/general/jquery-datatable/css/jquery.dataTables.css',
            'vendors/general/material-design-lite/material.css',
            'vendors/general/jquery-datatable/css/dataTables.material.css',
            'stylesheets/site/dashboard.css',
        ],
        scripts: [
            'vendors/general/jquery-datatable/js/jquery.dataTables.js',
            'vendors/general/jquery-datatable/js/dataTables.bootstrap4.js',
            'vendors/general/socket.io/socket.io.js',
            'javascripts/site/dashboard.js',
        ],
    });
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

module.exports = router;
