var rpc = new (require('./kafkarpc'))();

//make request to kafka
function make_request(queue_name, msg_payload, callback){
    console.log('in make request');
    console.log('username and password from passport :'+msg_payload.username);
    console.log('queue name from passport :'+queue_name);
	rpc.makeRequest(queue_name, msg_payload, function(err, response){

		if(err)
			console.error(err);
		else{
		    console.log("num 2");
			console.log("response in client make req", response);
			callback(null, response);
		}
	});
}

exports.make_request = make_request;
