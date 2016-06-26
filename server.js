var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var assignment = require('./tempdir/assignment/app.js');
var cookieParser = require("cookie-parser");
var session = require("express-session");
var passport = require("passport");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

/**
 * For parsing the cookies
 */
app.use(cookieParser());
app.use(session({
    secret: "randomstuff",
    /**
     * providing resave and saveUninitialized
     * to solve deprecation warnings
     */
    resave: true,
    saveUninitialized: true
}));

var project = require('./project/app.js');

app.use(passport.initialize());
app.use(passport.session());

// assignment(app);
project(app);

//----------------------------------------------------------------------------------------------------------------------

var connectionString = 'mongodb://127.0.0.1:27017/test';
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect(connectionString);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ipaddress);
