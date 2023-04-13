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
    if(session.userid){
        res.render('applicationsPage');
    } else {
        res.render('autenticationPage');
    }
});

app.get('/registration', function(req, res) {
    res.render('registrationPage');
});

app.get('/profile', function(req, res) {
    if(session.userid){
        res.render('profilePage', {  });
    } else {
        res.render('autenticationPage');
    }
});

// обработка данных из формы на странице регистрации
app.post('/autentication', urlencodedParser, function(req, res) {
    
    if (!req.body){
        return res.sendStatus(400);
    } else {
        if(req.body.passwordFirst == req.body.passwordSecond){
            let phoneNumber = req.body.phone.split('+');
            let newUser = new dbModule.User(
                req.body.surname, 
                req.body.name, 
                req.body.patronymic, 
                phoneNumber[1],
                req.body.login,
                req.body.passwordFirst);

            dbModule.Users.addUser(newUser);

            res.render('autenticationPage');
        } else {
            console.log("Passwords don't match");
            res.render('registrationPage');
        }
    }
});

// обработка данных из формы на странице аутентификации
app.post('/profile', urlencodedParser, function(req, res) {
    if (!req.body){
        return res.sendStatus(400);
    } else {
        let result = dbModule.Users.authenticateUser(req.body.autenticationLogin, req.body.autenticationPassword);
        if(typeof(result) == 'object'){
            console.log('Авторизация прошла успешно');
            req.session.userLogin = req.body.autenticationLogin;
            console.log(req.session);
            console.log(result);
            res.render('profilePage', { 
                                        surname: result.surname, 
                                        name: result.name, 
                                        patronymic: result.patronymic,
                                        phone: result.phone,
                                        login: result.login
                                    });
        } else if (result == 'Incorrect password'){
            console.log("Неправильный пароль");
            res.render('registrationPage'); // передать ошибку
        } 
    }
});

//обработка данных сос траницы профиля
app.post('/main', urlencodedParser, function(req, res) {
    
})
app.listen(3000);