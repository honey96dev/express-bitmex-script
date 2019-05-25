import express from 'express';
import config from '../core/config';

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index/index', {
        baseUrl: config.server.baseUrl,
        scripts: ['javascripts/pages/crud/metronic-datatable/advanced/row-details.js',],
    });
    // res.render('index/index', {baseUrl: config.server.baseUrl});
});

module.exports = router;
