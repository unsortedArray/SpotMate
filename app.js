var express = require('express');
var app = express();

app.use(express.static(__dirname +'/public/public'));


app.get('/',function (req,res) {
    res.sendFile(__dirname +'/public/public/index.html');

});

app.get('/login',function (req,res) {
    res.sendFile(__dirname + '/public/public/loginPage.html');
})

app.get('/signup',function (req,res) {
    res.sendFile(__dirname + '/public/public/SignUpPage.html');
});













app.listen(8000,function () {
    console.log("The server is running !")
});