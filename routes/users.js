import express from 'express';
import config from '../core/config';
import dbConn from '../core/dbConn';
import sprintfJs from 'sprintf-js';
import myCrypto from '../core/myCrypto';

const router = express.Router();

const loginProc = (req, res, next) => {
    const method = req.method.toUpperCase();
    if (method === 'POST') {
        const params = req.body;
        const email = params.email.trim();
        const password = params.password.trim();
        const hash = myCrypto.hmacHex(password);

        let sql = sprintfJs.sprintf("SELECT COUNT(`email`) `count` FROM `users` WHERE BINARY `email` = '%s';", email);
        dbConn.query(sql, null, (error, results, fields) => {
            if (error) {
                res.status(200).send({
                    result: 'error',
                    message: 'Unknown error',
                });
                return;
            }
            const count = parseInt(results[0].count);

            if (count === 0) {
                res.status(200).send({
                    result: 'error',
                    message: 'Your Email is Invalid',
                });
                return;
            }
            sql = sprintfJs.sprintf("SELECT COUNT(U.email) `count`,  U.* FROM `users` U WHERE BINARY U.email = '%s' AND BINARY U.password = '%s';", email, hash);
            console.log('login', sql);
            dbConn.query(sql, null, (error, results, fields) => {
                if (error) {
                    res.status(200).send({
                        result: 'error',
                        message: 'Unknown error',
                    });
                    return;
                }
                const count = parseInt(results[0].count);

                if (count === 0) {
                    res.status(200).send({
                        result: 'error',
                        message: 'Your password is invalid',
                    });
                } else {
                    req.session.user = {
                        id: results[0].id,
                        email: results[0].email,
                        name: results[0].name,
                    };
                    res.status(200).send({
                        result: 'success',
                        message: 'Successfully logined',
                    });
                }
            });
        });
    } else if (method === 'GET') {
        res.render('users/login', {baseUrl: config.server.baseUrl});
    } else {
        res.status(404).send('Not found');
    }
};

const signupProc = (req, res, next) => {
    const method = req.method.toUpperCase();
    if (method === 'POST') {
        // Signup logic
        const params = req.body;
        const email = params.email.trim();
        const password = params.password.trim();
        const name = params.name.trim();
        const hash = myCrypto.hmacHex(password);

        let sql = sprintfJs.sprintf("SELECT COUNT(`email`) `count` FROM `users` WHERE BINARY `email` = '%s';", email);
        dbConn.query(sql, null, (error, results, fields) => {
            if (error) {
                res.status(200).send({
                    result: 'error',
                    message: 'Unknown error',
                });
                return;
            }
            const count = parseInt(results[0].count);

            if (count > 0) {
                res.status(200).send({
                    result: 'error',
                    message: 'This email is already registered',
                });
                return;
            }
            sql = sprintfJs.sprintf("INSERT INTO `users`(`email`, `password`, `name`, `emailVerified`, `allow`) VALUES('%s', '%s', '%s', '0', '0');",
                email, hash, name);
            dbConn.query(sql, null, (error, results, fields) => {
                if (error) {
                    res.status(200).send({
                        result: 'error',
                        message: 'Unknown error',
                    });
                } else {
                    res.status(200).send({
                        result: 'success',
                        message: 'Successfully registered. Please activate your account by validation email.',
                    });
                }
            });
        });
    } else if (method === 'GET') {
        res.render('users/signup', {baseUrl: config.server.baseUrl});
    } else {
        res.status(404).send('Not found');
    }
};

router.all('/', loginProc);

router.all('/login', loginProc);

router.all('/signup', signupProc);

router.all('/logout', (req, res, next) => {
    const method = req.method.toUpperCase();
    if (method !== 'POST' && method !== 'GET') {
        res.status(404).send('Not found');
    } else {
        req.session.user = undefined;
        if (req.xhr) {
            res.status(200).send({
                baseUrl: config.server.baseUrl,
                result: 'success',
                message: 'Successfully logouted',
            });
        } else {
            // res.redirect(config.server.baseUrl);
            res.redirect('/');
        }
    }
});
module.exports = router;
