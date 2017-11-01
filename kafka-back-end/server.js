var connection =  new require('./kafka/Connection');
var login = require('./services/login');
var mongo = require("./services/mongo");
var mongoURL = "mongodb://localhost:27017/login";
var mongoRegisterURL = "mongodb://localhost:27017/sessions";
var fs = require('fs');

var consumer = connection.getConsumer();
var producer = connection.getProducer();

console.log('server is running');
consumer.on('message', function (message) {
    if(message.topic === "login_topic") {
        var data = JSON.parse(message.value);
        var res = {};
        mongo.connect(mongoRegisterURL, function () {
            console.log('Connected to mongo at: ' + mongoRegisterURL);
            var coll = mongo.collection('register');
            console.log('Connected to mongo with username: ' + data.data.username);

            coll.findOne({username: data.data.username, password: data.data.password}, function (err, user) {
                if (user) {
                    console.log("user data found in db");
                    res.code = "200";
                    res.value = "Success Login";

                } else {
                    console.log("user data NOT found in db");
                    res.code = "401";
                    res.value = "Failed Login";
                }

                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res.code
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log("producer payload" + data);
                });
                return;
            });


        });
    }
});

consumer.on('message', function (message) {
    var data = JSON.parse(message.value);
    var res = {};

    if(message.topic === "register_topic"){
        console.log('Register message received'+message.topic);
        console.log(JSON.stringify(message.value));

        mongo.connect(mongoRegisterURL, function(){
            console.log('Connected to mongo at: ' + mongoRegisterURL);
            var coll = mongo.collection('register');
            console.log("Registered firstname: "+data.data.firstname);
            console.log("Registered lastname: "+data.data.lastname);
            console.log("Registered username: "+data.data.username);
            console.log("Registered password: "+data.data.password);
            coll.insert({firstname:data.data.firstname, lastname: data.data.lastname, username: data.data.username, password:data.data.password }, function(err, user){
                if (err) {
                    res.code = "401";
                    res.value = "Failed Login";
                    console.log("KAFKA Insert failed");

                } else {
                    res.code = "200";
                    res.value = "Success Login";
                    console.log("KAFKA Insert success");

                }
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res.code
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log(data);
                });
                return;
            });
        });
    }
});


consumer.on('message', function (message) {
    var data = JSON.parse(message.value);
    if(message.topic === "directory1_topic")
    {
        console.log('directory_topic message received' + message.topic);
        console.log(JSON.stringify(message.value));
        console.log('directory_topic Path: ' + data.data.path);

        var response = "";
        //var testFolder = './routes/';
        var testFolder = data.data.path;
        console.log(testFolder);
        fs.readdir(testFolder, function (err, files)
        {
            console.log(files.length);
            console.log(files);
            var strJson="";
            for(var i=0;i<files.length;)
            {
                response += files[i]+"<br>";
                strJson += '{"files":"' + files[i] + '"}';
                i = i + 1;
                if (i < files.length) {
                    strJson += ',';
                }

            }
            strJson = '{"count":' + files.length + ',"DirectoryFiles":[' + strJson + "]}";
            console.log('after handle' + strJson);
            var payloads = [
                {
                    topic: data.replyTo,
                    test : response,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: strJson
                    }),
                    partition: 0
                }
            ];

            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    }

});

/*
consumer2.on('message', function (message) {
    console.log('Register message received'+message.topic);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    if(message.topic === "register_topic"){
        login.handle_register_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
    }
});

consumer1.on('message', function (message) {
    console.log('Login message received'+message.topic);
    console.log("Login message data "+JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    if(message.topic === "login_topic"){
        console.log("in login topic if block");
        login.handle_request(data.data, function(err,res){
            console.log('after handle req call data from db is: '+res.value);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log("producer payload"+data);
            });
            return;
        });
    }
});
*/
