

//setup express
var express = require('express');
var app = express();
//these two need for authentication
var passport = require('passport');
var session = require('express-session');
//extracts the entire body part of an incoming request and exposes it in a format, JSON format.
var bodyParser =require('body-parser');

var env = require('dotenv').load()
var exphbs = require('express-handlebars');
//Handlebars setup
app.set('views', './views')
app.engine('handlebars', exphbs({
    extname: '.handlebars'
}));
app.set('view engine', '.handlebars');

//bodyParser setup 
app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());

//Passport setup
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
 
app.use(passport.initialize());
 
app.use(passport.session()); // persistent login sessions

app.get('/', function(req,res){
    res.send("Welcome to Passport with sequelize");
});

//Models
var models = require("./models");
//Routes
var authRoute = require('./routes/auth.js')(app,passport);

//load passport strategies
require('./config/passport/passport.js')(passport, models.user);

//Sync Database
models.sequelize.sync().then(function(){
    console.log("Nice! database looks fine")
}).catch(function(err){
    console.log(err,"Something went wrong with the database update! ")
});


var port = process.env.PORT || 3000;

app.listen(port,function(err){
    if(!err)
        console.log("Listening on Port:" + port)
});