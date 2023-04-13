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
    static authenticateUser(login, password) {
        return new Promise((res, rej) => {
            db.get(`SELECT * FROM users WHERE login = '${login}'`, (err, result) => {
                if (err) {
                    console.log('FINDING USER FAILED', err);
                } else if (result){
                    if(result.password == password){
                        console.log('Passwords matched');
                        let thisUser = new User(result.id, result.surname, result.name, result.patronymic, result.phone, result.login, result.password);                        console.log(thisUser);
                         res(result.login);
                    } else if (result.password != password){
                        console.log('Incorrect password');
                         rej('Incorrect password');
                    }
                }
            });
        });
    }
    static findUser(userLogin) {
        return new Promise((res, rej) => {
            db.get(`SELECT * FROM users WHERE login = '${userLogin}'`, (err, result) => {
                if (err) {
                    console.log('FINDING USER FAILED', err);
                    rej('User does not exist');
                } else if (result){
                    console.log('User detected');
                    res(result);
                }
            });
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
                    sum TEXT NOT NULL,
                    dueDate DATE NOT NULL,
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

class Application {
    constructor(id, type, sum, dueDate, status){
        this.id = id;
        this.type = type;
        this.sum = sum;
        this.dueDate = dueDate;
        this.status = status;
    }
}

class Applications {
    static findApplication(user) {
        db.get(`SELECT id FROM users WHERE login = ${user.login}`, (err, result) => {
            if (err) {
                console.log('FINDING USER APPLICATIONS TABLE FAILED', err);
            } else if(result){
                let userTableName = 'id_' + result.id + '_applications';
                db.get(`SELECT * FROM ${userTableName}`, (err, result) => {
                    if (err) {
                        console.log('FINDING APPLICATIONS FAILED', err);
                    } else if (result){
                        console.log('Table detected');
                        return result;
                    }
                });
            }
        });
    }
    static addApplication(user, application) {
        db.get(`SELECT id FROM users WHERE login = ${user.login}`, (err, result) => {
            if (err) {
                console.log('FINDING USER APPLICATIONS TABLE FAILED', err);
            } else if(result){
                let userTableName = 'id_' + result.id + '_applications';
                const sql = `INSERT INTO ${userTableName}(type, sum, dueDate, status) values (?, ?, ?, ?)`;
                db.run(sql, application.type, application.sum, application.dueDate, 'На рассмотрении', (err) => {
                    if (err) {
                        console.log('ADDING APPLICATION FAILED', err);
                    }
                });
            }
        });
    }
    static deleteUser(user, application) {
        db.get(`SELECT id FROM users WHERE login = ${user.login}`, (err, result) => {
            if (err) {
                console.log('FINDING USER APPLICATIONS TABLE FAILED', err);
            } else if(result){
                let userTableName = 'id_' + result.id + '_applications';
                const sql = `DELETE FROM ${userTableName} WHERE id = '${application.id}'`;
                db.run(sql, (err) => {
                    if (err) {
                        console.log('DELITING APPLICATION FAILED', err);
                    }
                });
            }
        });
    }
}

module.exports = {
    db: db, 
    User: User, 
    Users: Users,
    Application: Application,
    Applications: Applications
};