const { isAuthorized, isAdmin } = require('../middleware/authorized');
const express = require('express');
const errorHandler = require('../middleware/error');
const router = express.Router();
const { generateToken } = require('../utils/utils');
const { initDb, dbRun, dbGet, dbAll } = require('../utils/db');
const bcrypt = require('bcrypt');

let db = initDb();
dbRun(db, 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, admin INTEGER NOT NULL);');
router.use(express.json());
router.use(isAuthorized);
router.use(isAdmin);

router.get('/', (req, res) => {
    res.json({status: 'ok', version: require('../package.json').version});
});

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    dbGet(db, 'SELECT count(*) FROM users WHERE username = ?', [username], (e, row) => {
        if(e) throw e;
        if(row) {
            if (Object.values(row)[0] > 0) {
                res.status(400).json({status: 'error', payload: 'User with that username already exists'});
            } else {
                bcrypt.hash(password, 10, (e, hash) => {
                    if(e) {
                        console.error(e.message);
                        res.status(500).json({status: 'error', payload: e.message});
                        return;
                    }
                    dbRun(db,`INSERT INTO users(username, password, admin) VALUES ('${username}', '${hash}', 0)`, []);
                    const token = generateToken(username, 0);
                    res.json({status: 'ok', token});
                })
            }
        }
    })
});

router.post('/signin', (req, res) => {
    try {
        const { username, password } = req.body;
        dbGet(db,'SELECT username, password, admin FROM users WHERE username = ?', [username], (e, row) => {
            if(row) {
                bcrypt.compare(password, row.password, (e, r) => {
                    if(e) {
                        res.status(500).json({status: 'error', payload: e.message});
                    }
                    if(r) {
                        const token = generateToken(username, row.admin);
                        res.json({status: 'ok', token});
                        return;
                    }
                    res.status(400).json({status: 'error', payload: 'incorrect password'});
                })
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

router.get('/users', (req, res) => {
    try {
        dbAll(db, 'SELECT id, username, admin FROM users', [], (e, rows) => {
            console.log(rows);
            if(rows) {
                res.json({status: 'ok', payload: rows});
                return;
            }
            if(e) {
                throw e;
            }
        })
    } catch (e) {
        throw e;
    }
});

router.get('/makeAdmin/:id', (req, res) => {
    try {
        console.log('som tu');
        dbRun(db, 'UPDATE users SET admin = 1 WHERE id = ?', [req.params.id]);
        res.json({status: 'ok'});
    } catch (e) {
        throw e;
    }
})

router.get('/removeAdmin/:id', (req, res) => {
    try {
        console.log('som tu');
        dbRun(db, 'UPDATE users SET admin = 0 WHERE id = ?', [req.params.id]);
        res.json({status: 'ok'});
    } catch (e) {
        throw e;
    }
})
router.use(errorHandler);

module.exports = router;