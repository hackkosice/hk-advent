const sqlite3 = require('sqlite3').verbose();

const initDb = () => {
    return new sqlite3.Database('./db/db.db', (err) => {
        if(err) {
            console.log(err.message);
        }
    });
}

const dbRun = (db, sql, args) => db.run(sql, args);
const dbAll = (db, sql, args, callback) => db.all(sql, args, callback);
const dbGet = (db, sql, args, callback) => db.get(sql, args, callback);

module.exports = {
    dbRun,
    dbAll,
    dbGet,
    initDb
}