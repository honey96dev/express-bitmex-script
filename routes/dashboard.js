import express from 'express';
import config from '../core/config';
import bitmexAccounts from '../core/bitmexAccounts';
import sprintfJs from "sprintf-js";
import dbConn from "../core/dbConn";

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    const styles = [
        // 'vendors/general/jquery-datatable/css/jquery.dataTables.css',
        'vendors/general/material-design-lite/material.css',
        'vendors/general/jquery-datatable/css/dataTables.material.css',
        'stylesheets/site/dashboard.css',
    ];
    const scripts = [
        'vendors/general/jquery-datatable/js/jquery.dataTables.js',
        'vendors/general/jquery-datatable/js/dataTables.bootstrap4.js',
        'vendors/general/socket.io/socket.io.js',
        'javascripts/site/dashboard.js',
    ];

    bitmexAccounts.accountList((data) => {
        res.render('dashboard/index', {
            baseUrl: config.server.baseUrl,
            uri: 'dashboard/index',
            styles: styles,
            scripts: scripts,
            bitmexAccounts: data,
        });
    }, (error) => {
        res.render('dashboard/index', {
            baseUrl: config.server.baseUrl,
            uri: 'dashboard/index',
            styles: styles,
            scripts: scripts,
            bitmexAccounts: [],
        });
    });

    // res.render('dashboard/index', {baseUrl: config.server.baseUrl});
});

router.post('/requestBitmexAccount', (req, res, next) => {
    const param = req.body;
    // req.session =
});


router.get('/logs', function (req, res, next) {
    const styles = [
        // 'vendors/general/jquery-datatable/css/jquery.dataTables.css',
        'vendors/general/material-design-lite/material.css',
        'vendors/general/jquery-datatable/css/dataTables.material.css',
        'stylesheets/site/logs.css',
    ];
    const scripts = [
        'vendors/general/jquery-datatable/js/jquery.dataTables.js',
        'vendors/general/jquery-datatable/js/dataTables.bootstrap4.js',
        'javascripts/site/logs.js',
    ];

    res.render('dashboard/logs', {
        baseUrl: config.server.baseUrl,
        uri: 'dashboard/logs',
        styles: styles,
        scripts: scripts,
    });

});

router.get('/logs/list', (req, res, next) => {
    let sql = sprintfJs.sprintf("SELECT * FROM `bitmex_log`;");

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

module.exports = router;
