var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
require('./routes/passport')(passport);

var routes = require('./routes/index');
var users = require('./routes/users');
var kafka = require('./routes/kafka/client');

var mongoSessionURL = "mongodb://localhost:27017/sessions";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}
app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSessions({
    secret: "CMPE273_passport",
    resave: false,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));
app.use(passport.initialize());

app.use('/', routes);
app.use('/users', users);

app.post('/logout', function(req,res) {
    console.log(req.session.user);
    req.session.destroy();
    console.log('Session Destroyed');
    res.status(200).send();
});

app.post('/login', function(req, res) {
    passport.authenticate('login', function(err, user) {
        if(err) {
            res.end(err);
        }

        if(!user) {
            res.status(401).send();
        }

        if(user){
            res.status(201).send();
        }
        req.session.user = user.username;
        console.log(req.session.user);
        console.log("session initilized");
       // return res.status(201).send({username:"test"});
    })(req, res);
});

app.post('/register', function(req, res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var password = req.body.password;
    kafka.make_request('register_topic',{"username":username,"password":password,"firstname":firstname,"lastname":lastname}, function(err,results){
        console.log('in result');
        console.log(results);
        if(err){
            res.end(err);
        }
        else
        {
            if(results){
                req.session.user = username;
                res.status(201).send({username:username});

            }
            else {
                res.status(401).send();
            }
        }
    });
});

app.post('/listDir', function(req, res){
    var path = req.body.path;
    kafka.make_request('directory1_topic',{"path":path}, function(err,results){
        console.log('in result');
        console.log(results);
        if(err){
            res.end(err);
        }
        else
        {
            if(results){
                global.files = results;
                res.status(201).send(results);
            }
            else {
                res.status(401).send();
            }
        }
    });
});

app.get('/listDirFiles',function(req, res) {
    if(global.files)
    {
        strJson = global.files;
        //res.status(200).send(JSON.parse(strJson));
        //res.status(201).send(global.files);
        console.log("Y:   "+strJson);

        res.status(201).send(JSON.parse(strJson));
    }
    else
    {
        console.log("N");
        res.status(401).json({message: "No files"});
    }
});

/*app.get('/listDir',function(req, res){
    var path = req.body.path;
    kafka.make_request('directory_topic',{"path":path}, function(err,results){
        console.log('in result');
        console.log(results);
        if(err){
            res.end(err);
        }
        else
        {
            if(results.code == 200){
                console.log(results.response);
                res.status(201).send(results);
            }
            else {
                res.status(401).send();
            }
        }
    });
});*/
module.exports = app;
