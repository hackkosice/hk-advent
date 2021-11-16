const { isAuthorized } = require('../middleware/authorized');
const express = require('express');
const errorHandler = require('../middleware/error');
const router = express.Router();
const { generateToken } = require('../utils/utils');
const { initDb, dbRun, dbGet } = require('../utils/db');

let db = initDb();
dbRun(db, 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL);');
router.use(express.json());
router.use(isAuthorized);

router.get('/', (req, res) => {
    res.json({status: 'ok', version: require('../package.json').version});
});

router.post('/signup', (req, res) => {
    const { email, password } = req.body;
    dbGet(db, 'SELECT count(*) FROM users WHERE email = ?', [email], (e, row) => {
        if(e) throw e;
        if(row) {
            if (Object.values(row)[0] > 0) {
                res.status(400).json({status: 'error', payload: 'User with that e-mail already exists'});
            } else {
                dbRun(db,`INSERT INTO users(email, password) VALUES ('${email}', '${password}')`, []);
                const token = generateToken(email);
                res.json({status: 'ok', token});
            }
        }
    })
});

router.post('/signin', (req, res) => {
    try {
        const { email, password } = req.body;
        dbGet(db,'SELECT email, password FROM users WHERE email = ?', [email], (e, row) => {
            if(row) {
                if(password === row.password) {
                    const token = generateToken(email);
                    res.json({status: 'ok', token});
                    return;
                }
                res.status(400).json({status: 'error', payload: 'incorrect password'});
                return;
            }
            if(e) {
                throw e;
            }
            res.status(400).json({status: 'error', payload: 'User with that e-mail does not exist'});
        })
    } catch (e) {
        throw e;
    }
})
router.use(errorHandler);

module.exports = router;