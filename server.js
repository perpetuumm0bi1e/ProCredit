const express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var dbModule = require('./db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

app.use(
    session({
        secret: 'secret key',
        saveUninitialized: true,
    })
)

app.set('view engine', 'ejs');

// маршрутизация
app.get('/', function(req, res) {
    res.render('mainPage');
});

app.get('/autentication', function(req, res) {
    res.render('autenticationPage', { error: 'blocks/noErrors.ejs' });
});

app.get('/applications', function(req, res) {
    if (req.session.userLogin) {
        res.render('applicationsPage');
    } else {
        res.render('autenticationPage', { error: 'blocks/noErrors.ejs' });
    }
});

app.get('/registration', function(req, res) {
    res.render('registrationPage', { error: 'blocks/noErrors.ejs' });
});

app.get('/profile', function(req, res) {
    if (req.session.userLogin) {
        res.render('profilePage', {
            surname: req.session.userSurname,
            name: req.session.userName,
            patronymic: req.session.userPatronymic,
            phone: req.session.userPhone,
            login: req.session.userLogin,
            password: req.session.userPassword
        });
    } else {
        res.render('autenticationPage', { error: 'blocks/noErrors.ejs' });
    }
});

// обработка данных из формы на странице регистрации

app.post('/registered', urlencodedParser, function(req, res) {
    if (!req.body) {
        res.render('registrationPage', { error: 'blocks/dataNotFilled.ejs' }); // данные не введены
    } else {
        if (req.body.passwordFirst == req.body.passwordSecond) {
            let phoneNumber = req.body.phone.split('+');
            let patronymic;

            if (req.body.patronymic == undefined) {
                patronymic = '';
            } else {
                patronymic = req.body.patronymic;
            }

            req.session.userSurname = req.body.surname;
            req.session.userName = req.body.name;
            req.session.userPatronymic = patronymic;
            req.session.userPhone = phoneNumber[1];
            req.session.userLogin = req.body.login;
            req.session.userPassword = req.body.passwordFirst;

            let newUser = new dbModule.User(
                req.body.surname,
                req.body.name,
                patronymic,
                phoneNumber[1],
                req.body.login,
                req.body.passwordFirst);

            dbModule.Users.addUser(newUser);

            res.render('profilePage', {
                surname: newUser.surname,
                name: newUser.name,
                patronymic: newUser.patronymic,
                phone: newUser.phone,
                login: newUser.login,
                password: newUser.password
            });
        } else {
            res.render('registrationPage', { error: 'blocks/unmatchedPasswords.ejs' }); //па  пароли не совпали
        }
    }
});
// обработка данных из формы на странице аутентификации
app.post('/autenticated', urlencodedParser, function(req, res) {
    if (!req.body) {
        res.render('autenticationPage', { error: 'blocks/dataNotFilled.ejs' }); // данные не введены
    } else {
        dbModule.db.get(`SELECT * FROM users WHERE login = '${req.body.autenticationLogin}'`, (err, result) => {
            if (err) {
                res.render('autenticationPage', { error: 'blocks/nonexistendUser.ejs' }); // передать ошибку
            } else if (result) {
                if (result.password == req.body.autenticationPassword) {
                    req.session.userSurname = result.surname;
                    req.session.userName = result.name;
                    req.session.userPatronymic = result.patronymic;
                    req.session.userPhone = result.phone;
                    req.session.userLogin = result.login;
                    req.session.userPassword = result.password;

                    res.render('profilePage', {
                        surname: result.surname,
                        name: result.name,
                        patronymic: result.patronymic,
                        phone: result.phone,
                        login: result.login,
                        password: result.password
                    });
                } else if (result.password != req.body.autenticationPassword) {
                    res.render('autenticationPage', { error: 'blocks/incorrectPassword.ejs' }); // неправильынй пароль                }
                } else {
                    res.render('autenticationPage', { error: 'blocks/nonexistentUser.ejs' }); // пользователь не найден
                }
            }
        });
    }
});

//обработка данных сос траницы профиля
app.post('/editAccount', urlencodedParser, function(req, res) {
    if (req.body.editPersonalInformation) {
        res.render('editProfilePage', {
            surname: req.session.userSurname,
            name: req.session.userName,
            patronymic: req.session.userPatronymic,
            phone: req.session.userPhone,
            login: req.session.userLogin,
            password: req.session.userPassword,
            error: 'blocks/noErrors.ejs'
        });
    } else if (req.body.logOut) {
        req.session.destroy();
        res.render('autenticationPage', { error: 'blocks/noErrors.ejs' });
    } else if (req.body.deleteAnAccount) {
        dbModule.Users.deleteUser(req.session.userLogin);
        res.render('autenticationPage', { error: 'blocks/noErrors.ejs' });
    }
})

//обработка данных после изменения аккаунта
app.post('/saveChanges', urlencodedParser, function(req, res) {
    if (!req.body) {
        res.render('editProfilePage', {
            surname: req.session.userSurname,
            name: req.session.userName,
            patronymic: req.session.userPatronymic,
            phone: req.session.userPhone,
            login: req.session.userLogin,
            password: req.session.userPassword,
            error: 'blocks/dataNotFilled.ejs'
        });
    } else {
        let phoneNumber = req.body.newPhone.split('+');
        let newFIOParsed = req.body.newFIO.split(' ');
        let patronymic;

        if (newFIOParsed.length == 2) {
            patronymic = '';
        } else {
            patronymic = newFIOParsed[2];
        }
        if (newFIOParsed.length > 3 || newFIOParsed.length < 2) {
            res.render('editProfilePage', {
                surname: req.session.userSurname,
                name: req.session.userName,
                patronymic: req.session.userPatronymic,
                phone: req.session.userPhone,
                login: req.session.userLogin,
                password: req.session.userPassword,
                error: 'blocks/incorrectFIOLength.ejs'
            });
        }
        let newData = new dbModule.User(
            newFIOParsed[0],
            newFIOParsed[1],
            patronymic,
            phoneNumber[1],
            req.body.newLogin,
            req.body.newPassword);
        dbModule.Users.editUser(req.session.userLogin, newData);

        req.session.userSurname = newData.surname;
        req.session.userName = newData.name;
        req.session.userPatronymic = newData.patronymic;
        req.session.userPhone = newData.phone;
        req.session.userLogin = newData.login;
        req.session.userPassword = newData.password;

        res.render('profilePage', {
            surname: req.session.userSurname,
            name: req.session.userName,
            patronymic: req.session.userPatronymic,
            phone: req.session.userPhone,
            login: req.session.userLogin,
            password: req.session.userPassword,
            error: 'blocks/noErrors.ejs'
        });
    }
});
app.listen(3000);