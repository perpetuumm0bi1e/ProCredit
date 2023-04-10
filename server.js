var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();
var dbModule = require('./db');

app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

// маршрутизация
app.get('/', function(req, res) {
    res.render('mainPage');
});

app.get('/authorization', function(req, res) {
    res.render('authorizationPage');
});

app.get('/applications', function(req, res) {
    res.render('applicationsPage');
});

app.get('/registration', function(req, res) {
    res.render('registrationPage');
});

app.get('/profile', function(req, res) {
    res.render('profilePage');
});

app.get('/random', function(req, res) {
    let text = 'Какие-то услуги';
    res.render('random', {text: text});
});

// обработка данных из формы на странице регистрации
app.post('/profile', urlencodedParser, function(req, res) {
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

            res.render('profilePage');
        } else {
            console.log("Passwords don't match");
            res.render('registrationPage');
        }
    }
});

app.listen(3000);