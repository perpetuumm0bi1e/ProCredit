var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/mainPage.html');
});

app.get('/authorization', function(req, res) {
    res.sendFile(__dirname + "/public/authorizationPage.html");
});

app.listen(3000);