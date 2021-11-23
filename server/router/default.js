const { isAuthorized, isAdmin } = require('../middleware/authorized');
const express = require('express');
const errorHandler = require('../middleware/error');
const router = express.Router();
const { generateToken } = require('../utils/utils');
const { initDb, dbRun, dbGet, dbAll } = require('../utils/db');
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');

let db = initDb();
dbRun(db, 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, admin INTEGER NOT NULL);');
dbRun(db, 'CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY, day INTEGER NOT NULL UNIQUE, dateStart TEXT NOT NULL, title TEXT NOT NULL, text TEXT NOT NULL, answer TEXT NOT NULL);');
dbRun(db, 'CREATE TABLE IF NOT EXISTS submissions(id INTEGER PRIMARY KEY, username TEXT NOT NULL, day INTEGER NOT NULL, answer TEXT NOT NULL);');
dbRun(db, 'CREATE TABLE IF NOT EXISTS correctAnswers(id INTEGER PRIMARY KEY, username TEXT NOT NULL, day INTEGER NOT NULL);');
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
        dbRun(db, 'UPDATE users SET admin = 1 WHERE id = ?', [req.params.id]);
        res.json({status: 'ok'});
    } catch (e) {
        throw e;
    }
})

router.get('/removeAdmin/:id', (req, res) => {
    try {
        dbRun(db, 'UPDATE users SET admin = 0 WHERE id = ?', [req.params.id]);
        res.json({status: 'ok'});
    } catch (e) {
        throw e;
    }
})

router.post('/task/submit', (req, res) => {
    const { day, title, text, answer } = req.body;
    dbGet(db, 'SELECT count(*) FROM tasks WHERE day = ?', [day], (e, row) => {
        if(e) {
            console.error(e.message);
            throw e;
        }
        if(row) {
            const dateStart = dayjs().month(11).date(day).format("YYYY-MM-DD");
            if (Object.values(row)[0] > 0) {
                dbRun(db, 'UPDATE tasks SET dateStart = ?, title = ?, text = ?, answer = ? WHERE day = ?', [dateStart, title, text, answer, day]);
                res.json({status: 'ok'});
            } else {
                dbRun(db, 'INSERT INTO tasks(day, dateStart, title, text, answer) VALUES (?, ?, ?, ?, ?)', [day, dateStart, title, text, answer]);
                res.json({status: 'ok'});
            }
        }
    })
});

router.get('/tasks', (req, res) => {
    const { username } = req.user;
    dbAll(db, 'SELECT day, dateStart, title, text FROM tasks', [], (e, rows) => {
        dbAll(db, 'SELECT username, day FROM correctAnswers', [], (e2, rows2) => {
            if(rows) {
                // res.json({status: 'ok', payload: rows.filter(r => dayjs().isAfter(dayjs(r.dateStart)))
                //     .map(row => ({...row, done: rows2.some(r => r.username === username && r.day === row.day)}))
                //     .sort((a,b) => a.day - b.day)});
                res.json({status: 'ok', payload: rows.map(row => ({...row, done: rows2.some(r => r.username === username && r.day === row.day)})).sort((a,b) => a.day - b.day)});
                return;
            }
            if(e) {
                throw e;
            }
        })
    });
});

router.get('/task/:day', (req, res) => {
    const day = req.params.day;
    dbGet(db, 'SELECT title, text, answer FROM tasks WHERE day = ?', [day], (e, row) => {
        if(e) throw e;
        if(row) {
            res.json({status: 'ok', payload: [row]});
            return;
        }
        res.json({status: 'ok', payload: []});
    })
})

router.post('/submission', (req, res) => {
    const { day, answer } = req.body;
    const { username } = req.user;
    dbRun(db, 'INSERT INTO submissions(username, day, answer) VALUES (?, ?, ?)', [username, day, answer]);
    dbGet(db, 'SELECT answer FROM tasks WHERE day = ?', [day], (e, row) => {
        if(e) throw e;
        if(row) {
            if(row.answer === answer) {
                res.json({status: 'ok', payload: 'correct'});
                dbRun(db, 'INSERT INTO correctAnswers(username, day) VALUES (?, ?)', [username, day]);
            } else {
                res.json({status: 'ok', payload: 'incorrect'});
            }
        }
    })
});

router.use(errorHandler);
module.exports = router;