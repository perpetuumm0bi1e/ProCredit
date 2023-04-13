var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();
var dbModule = require('./db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

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
        console.log(typeof(result));
        if(typeof(result) == 'object'){
            /*
            session = req.session;
            session.userid = req.result.id;

            console.log('Сессия запущена');
            console.log(req.session);
            */
console.log('Авторизация прошла успешно');
            res.render('profilePage', { 
                                        surname: result.surname, 
                                        name: result.name, 
                                        patronymic: result.patronymic,
                                        phone: result.phone,
                                        login: result.login
                                    });
        } else if (result == null){
            console.log("Incorrect");

            res.render('registrationPage'); // передать ошибку
        } 
        /*
        else if (result == 'notFound'){
            console.log("Not found");

            res.render('registrationPage'); // передать ошибку
        }
        */
    }
});

//обработка данных сос траницы профиля
app.post('/main', urlencodedParser, function(req, res) {
    
})
app.listen(3000);