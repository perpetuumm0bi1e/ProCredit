const sqlite3 = require('sqlite3').verbose();
const dbName = 'later.sqlite';
const db = new sqlite3.Database(dbName);

db.serialize(() => {
    const sql = `CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        surname TEXT NOT NULL,
        name TEXT NOT NULL,
        patronymic TEXT NOT NULL,
        phone TEXT NOT NULL,
        login TEXT NOT NULL,
        password TEXT NOT NULL 
    )`;
    db.run(sql);
});
class User {
    constructor(surname, name, patronymic, phone, login, password){
        this.surname = surname;
        this.name = name;
        this.patronymic =patronymic;
        this.phone = phone;
        this.login = login;
        this.password = password;
    }
}
class Users {
    static findUser(user) {
        db.get(`SELECT * FROM users WHERE login = '${user.login}'`, (err, result) => {
            if (err) {
                console.log('FINDING USER FAILED', err);
            } else if (result){
                console.log('User detected');
            }
        });
    }
    static addUser(user) {
        const sql = `INSERT INTO users(surname, name, patronymic, phone, login, password)
        values (?, ?, ?, ?, ?, ?)`;
        db.run(sql, user.surname, user.name, user.patronymic, user.phone, user.login, user.password, (err) => {
            if (err) {
                console.log('ADDING USER FAILED', err);
            }
        });
        const sql2 = `SELECT id FROM users WHERE login = '${user.login}'`;
        db.get(sql2, (err, result) => {
            if (err) {
                console.log('CREATING USER TABLE FAILED', err);
            } else if(result){
                let userTableName = 'id_' + result.id + '_applications';
                const sql = `CREATE TABLE IF NOT EXISTS ${userTableName}(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    type TEXT NOT NULL,
                    name TEXT NOT NULL,
                    sum TEXT NOT NULL,
                    dueDate TEXT NOT NULL,
                    status TEXT NOT NULL 
                    )`;
                    db.run(sql);
            }
        });
    }
    static deleteUser(user) {
        const sql = `DELETE FROM users WHERE login = '${user.login}'`;
        db.run(sql, (err) => {
            if (err) {
                console.log('DELITING USER FAILED', err);
            }
        })
    }
}
module.exports = {
    db: db, 
    User: User, 
    Users: Users
};