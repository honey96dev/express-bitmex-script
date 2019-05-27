import express from 'express';
import config from '../core/config';
import bitmexAccounts from '../core/bitmexAccounts';

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

module.exports = router;
