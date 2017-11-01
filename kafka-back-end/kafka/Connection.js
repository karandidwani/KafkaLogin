var kafka = require('kafka-node');

var topics = [
    {topic: 'login_topic', partition: 0},
    {topic: 'register_topic', partition: 0},
    {topic: 'directory1_topic', partition: 0}
    ];


function ConnectionProvider() {
    this.getConsumer = function(topic_name) {
        if (!this.kafkaConsumerConnection) {

            this.client = new kafka.Client("localhost:2181");
            this.kafkaConsumerConnection = new kafka.Consumer(this.client,topics);
            this.client.on('ready', function () { console.log('client ready! with topic '+topics.topic) })
        }
        return this.kafkaConsumerConnection;
    };

    //Code will be executed when we start Producer
    this.getProducer = function() {

        if (!this.kafkaProducerConnection) {
            this.client = new kafka.Client("localhost:2181");
            var HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducerConnection = new HighLevelProducer(this.client);
            //this.kafkaConnection = new kafka.Producer(this.client);
            console.log('producer ready');
        }
        return this.kafkaProducerConnection;
    };
}
exports = module.exports = new ConnectionProvider;