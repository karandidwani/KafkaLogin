var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongoURL = "mongodb://localhost:27017/login";
var kafka = require('./kafka/client');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username , password, done) {
        console.log('in passport login ');
        kafka.make_request('login_topic',{"username":username,"password":password}, function(err,results){
            console.log('in result of passport make req');
            console.log(results);
            if(err){
                done(err,{});
            }
            else
            {
                if(results){
                    //done(null,{username:"bhavan@b.com",password:"a"});
                    done(null,results);
                }
                else {
                    done(null,false);
                }
            }
        });
        /*try {
            if(username == "bhavan@b.com" && password == "a"){
                done(null,{username:"bhavan@b.com",password:"a"});
            }
            else
                done(null,false);
        }
        catch (e){
            done(e,{});
        }*/
    }));
};


