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
    constructor(surname, name, patronymic, phone, login, password) {
        this.surname = surname;
        this.name = name;
        this.patronymic = patronymic;
        this.phone = phone;
        this.login = login;
        this.password = password;
    }
}
class Users {
    static findUser(login) {
        return new Promise((res, rej) => {
            db.get(`SELECT * FROM users WHERE login = '${login}'`, (err, result) => {
                if (err) {
                    console.log('FINDING USER FAILED', err);
                    rej('User does not exist');
                } else if (result) {
                    console.log('USER DETECTED');
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
        db.get(`SELECT id FROM users WHERE login = '${user.login}'`, (err, result) => {
            if (err) {
                console.log('FINDING USER FAILED', err);
            } else if (result) {
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
    static deleteUser(login) {
        db.get(`SELECT id FROM users WHERE login = '${login}'`, (err, result) => {
            if (err) {
                console.log('FINDING USER FAILED', err);
            } else if (result) {
                let userTableName = 'id_' + result.id + '_applications';
                db.run(`DROP TABLE IF EXISTS ${userTableName}`, (err) => {
                    if (err) {
                        console.log('DELETING USER TABLE ERROR', err);
                    } else {
                        console.log('USER TABLE DELETED');
                    }
                });
            }
        });
        db.run(`DELETE FROM users WHERE login = '${login}'`, (err) => {
            if (err) {
                console.log('DELITING USER FAILED', err);
            } else {
                console.log('USER DELETED');
            }
        });

    }
    static editUser(login, newData) {
        db.run(`UPDATE users 
                SET 
                surname = ?, 
                name = ?, 
                patronymic = ?, 
                phone = ?, 
                login = ?, 
                password = ?
                WHERE login = '${login}'`, newData.surname, newData.name, newData.patronymic, newData.phone, newData.login, newData.password, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('USER DATA EDITED');
            }
        });
    }
}

class Application {
    constructor(type, sum, dueDate, status) {
        this.type = type;
        this.sum = sum;
        this.dueDate = dueDate;
        this.status = status;
    }
}

class Applications {
    static findApplication(login) {
        db.get(`SELECT id FROM users WHERE login = '${login}'`, (err, result) => {
            if (err) {
                console.log('FINDING USER APPLICATIONS TABLE FAILED', err);
            } else if (result) {
                let userTableName = 'id_' + result.id + '_applications';
                db.get(`SELECT * FROM ${userTableName}`, (err, result) => {
                    if (err) {
                        console.log('FINDING APPLICATIONS FAILED', err);
                    } else if (result) {
                        console.log('TABLE DETECTED');
                        return result;
                    }
                });
            }
        });
    }
    static addApplication(login, application) {
        db.get(`SELECT id FROM users WHERE login = '${login}'`, (err, result) => {
            if (err) {
                console.log('FINDING USER APPLICATIONS TABLE FAILED', err);
            } else if (result) {
                let userTableName = 'id_' + result.id + '_applications';
                db.run(`INSERT INTO ${userTableName}(type, sum, dueDate, status) values (?, ?, ?, ?)`, 
                        application.type,
                        application.sum,
                        application.dueDate,
                        application.status,
                        (err) => {
                    if (err) {
                        console.log('ADDING APPLICATION FAILED', err);
                    }
                });
            }
        });
    }
    static deleteUser(login, application) {
        db.get(`SELECT id FROM users WHERE login = '${login}'`, (err, result) => {
            if (err) {
                console.log('FINDING USER APPLICATIONS TABLE FAILED', err);
            } else if (result) {
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