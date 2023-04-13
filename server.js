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
    res.render('autenticationPage');
});

app.get('/applications', function(req, res) {
    if (session.userid) {
        res.render('applicationsPage');
    } else {
        res.render('autenticationPage');
    }
});

app.get('/registration', function(req, res) {
    res.render('registrationPage');
});

app.get('/profile', function(req, res) {
    if (session.userid) {
        res.render('profilePage', {});
    } else {
        res.render('autenticationPage');
    }
});

// обработка данных из формы на странице регистрации

app.post('/registered', urlencodedParser, function(req, res) {

    if (!req.body) {
        return res.sendStatus(400);
    } else {
        if (req.body.passwordFirst == req.body.passwordSecond) {
            console.log('Passwords matched. User successfully registered.');
            req.session.userLogin = req.body.login;
            console.log(req.session);
            let phoneNumber = req.body.phone.split('+');
            let newUser = new dbModule.User(
                req.body.surname,
                req.body.name,
                req.body.patronymic,
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
            console.log("Passwords don't match");
            res.render('registrationPage');
        }
    }
});
// обработка данных из формы на странице аутентификации
app.post('/autenticated', urlencodedParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    } else {
        dbModule.db.get(`SELECT * FROM users WHERE login = '${req.body.autenticationLogin}'`, (err, result) => {
            if (err) {
                console.log('FINDING USER FAILED', err);
            } else if (result) {
                if (result.password == req.body.autenticationPassword) {
                    console.log('Passwords matched. User successfully autenticated.');
                    req.session.userLogin = req.body.autenticationLogin;
                    console.log(req.session);
                    res.render('profilePage', {
                        surname: result.surname,
                        name: result.name,
                        patronymic: result.patronymic,
                        phone: result.phone,
                        login: result.login,
                        password: result.password
                    });
                } else if (result.password != password) {
                    console.log("Incorrect password.");
                    res.render('registrationPage'); // передать ошибку
                }
            }
        });
    }
});

//обработка данных сос траницы профиля
app.post('/main', urlencodedParser, function(req, res) {

})
app.listen(3000);