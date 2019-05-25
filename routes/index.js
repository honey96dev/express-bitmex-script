import express from 'express';
import config from '../core/config';

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index/index', {
        baseUrl: config.server.baseUrl,
        styles: [
            '//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css',
            'stylesheets/site/dashboard.css',
        ],
        scripts: [
            '//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js',
            'javascripts/site/dashboard.js',
        ],
    });
    // res.render('index/index', {baseUrl: config.server.baseUrl});
});

module.exports = router;
