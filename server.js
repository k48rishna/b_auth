var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

app.use(express.static(__dirname + '/public'));
//redis
var config = require('./config/database.js');
var redisClient = config.redis;

redisClient.on('connect', function(){
    console.log('redis connected');
});
var port = process.env.Port || 3000;
mongoose.connect(config.db.url);
mongoose.connection.on("error", function(err) {
    console.log('Faied to connect to DB ' + ' on startup ', err);
    if (err) {
        console.log('Faied to connect to DB ' + ' on startup ', err);
        return next(err);
    }
});
mongoose.connection.on("connected", function(ref) {
    console.log("Connected to " + " DB!"+ref);
});
app.use(express.static(__dirname + '/public'));
console.log("Connected");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(function(req, res, next){
    res.setHeader('Acces-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods','GET','POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
//routes
var route_auth = require('./routes/auth.js');

app.post('/signup', route_auth.signup);
app.post('/authenticate',route_auth.login);
app.post('/me',route_auth.ensureAuth, function(req, res, next) {
    console.log("cookies"+req.cookies);
    console.log(req.body);
    res.json('success');

});
app.post('/merchlogout',route_auth.ensureAuth, route_auth.logout);

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, function(){
    console.log('server is at port' + port);
});
/*
 app.get('/cool', function(req, res) {
 res.sendFile(__dirname + '/public/login_page.html');
 });
 app.get('/cool', function(req, res) {
 console.log('User-Agent: ' + req.xhr);
 console.log("/*");
 res.write(req.headers['user-agent']+ "req.xhr" + req.xhr);
 res.end();
 });
 redisClient.srem([user3.email + "web", req.token], function (err, redisReply) {
 console.log("token deleted:" + redisReply);
 });
 User.findOne({token:req.token}, function(err,user){

 if (err){
 res.json({
 type: false,
 data : "error Occurred:"+err
 });
 }
 else if (user){
 res.json({
 type: true,
 data: user
 });
 }
 else{
 res.json({
 type: false,
 data : "unknown err at me"
 });
 }
 });*/
/*
 function sendMerch() {
 User.findOne({email: req.body.email}, function (err, user) {
 if (err) {
 res.json({
 type: false,
 data: "authenticate error occurred :" + err
 });
 }
 else if (user) {
 res.json({
 type: true,
 data: user
 });
 }

 });
 }*/