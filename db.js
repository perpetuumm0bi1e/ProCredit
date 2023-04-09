const sqlite3 = require('sqlite3').verbose();
const dbName = 'later.sqlite';
const db = new sqlite3.Database(dbName);

db.serialize(() => {
    const sql = `CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        surname TEXT NOT NULL,
        name TEXT NOT NULL,
        patronymic TEXT NOT NULL,
        login TEXT NOT NULL,
        password TEXT NOT NULL 
    )`;

    db.run(sql);
});

class Users {
    static findUser(login) {
        db.get(`SELECT * FROM users WHERE login = ${login}`, (err) => {
            if (err) {
                console.log('FINDING USER FAILED', err);
            }
        });
    }
    static addUser(surname, name, patronymic, login, password) {
        const sql = `INSERT INTO users(surname, name, patronymic, login, password)
        values (?, ?, ?, ?, ?)`;
        db.run(sql, surname, name, patronymic, login, password, (err) => {
            if (err) {
                console.log('ADDING USER FAILED', err);
            }
        })
    }
    static deleteUser(login) {
        const sql = `DELETE FROM users WHERE login = ${login}`;
        db.run(sql, (err) => {
            if (err) {
                console.log('DELITING USER FAILED', err);
            }
        })
    }
}