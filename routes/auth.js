/**
 * Created by kanhaiya on 10/26/2015.
 */
var User = require('../models/user.js');
var config = require('../config/database.js');
var redisClient = config.redis;
var jwt = require('jsonwebtoken');
var tokenKey = {};
var code = config.db.secret;

function tokenGenerate(user3){
    tokenKey = jwt.sign(user3.email, code +Date.now() ,{expiresIn : "7 days"});
    console.log(tokenKey);
    redisClient.sadd([user3.email+"web",tokenKey],function(err,redisReply){
        console.log("token add:" + redisReply);
    });
    return tokenKey;
}

module.exports.signup = function (req, res) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: false,
                    data: "User already exists!"
                                                    });
            } else {
                var userModel = new User();
                userModel.email = req.body.email;
                userModel.password = userModel.generateHash( req.body.password);
                userModel.save(function(err, user1) {
                    res.json({
                        type: true,
                        data: user1,
                        token: tokenGenerate(user1)
                    });

                });
            }
        }
    });
};
module.exports.login = function(req,res){
    console.log("authenticate");
    User.findOne({email:req.body.email}, function(err, user){
        if(err) {
            res.json({
                type: false,
                data: "authenticate error occured :" +err
            });
        }
        else if(!user) {
            res.json({
                type: false,
                data: "user not found :" + user
            });
        }
        else if(!user.validPassword(req.body.password)) {
            res.json({
                type: false,
                data:  "wrong Password"

            });
        }
        else{
            res.json({
                type: true,
                data:  user,
                token: tokenGenerate(user)
            });
        }


    });
};

module.exports.ensureAuth = function(req,res,next){
    var bearerToken;
    var emailToken;
    var bearerHeader = req.headers["authorization"];
    var bearer = bearerHeader.split(" ");
    req.emailToken = bearer[0];
    req.token = bearer[1];
    console.log("ensureAuth");
    console.log("hi"+req.emailToken);
    redisClient.sismember([req.emailToken + "web", req.token], function (err, redisReply) {
        if(err){
            console.log("errrr2");
            res.sendStatus(403);
        }
        else if(redisReply==1) {
            console.log("success emailToken"+redisReply);
            return next();
        }
        else{
            console.log("errrr1"+redisReply);
            res.sendStatus(403);
        }
    });
};
module.exports.logout = function(req, res) {
    console.log("merchlogout");
    redisClient.srem([req.emailToken + "web", req.token],function(err, redisReply){
        if(err){
            res.json({
                data:false
            });
            console.log("logout error srem");
        }
        else if(redisReply==1){
            console.log("logout success srem=1");
            res.json({
                data:true
            });
        }
        else if(redisReply==0){
            console.log("logout  srem=0");

            res.json({
                data:false
            });
        }
        else{
            console.log("logout last else error ");
            res.json({
                data:false
            });
         }
    });

  };