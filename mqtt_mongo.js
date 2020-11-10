
const mqtt    = require('mqtt');
const broker = 'mqtt://broker.hivemq.com:1883';
const user = '';
const pw = '';

mq = mqtt.connect(broker, {
  'username': user,
  'password': pw
});

const MongoClient = require('mongodb').MongoClient;

var myCollection;
var db;
var client_m;
var obj;


mq.on('message', function(topic, message) {
  console.log(message.toString('utf8'));
  obj = JSON.parse(message);
  console.log(obj.Time, obj.T, obj.H);
	createConnection(function(){
    		addDocument(function(){
		});
	});
});

mq.on('connect', function(){
    console.log('Connected.....');
});

mq.subscribe('automaatio/#');

function addDocument(onAdded){
			myCollection.insert(obj, function(err, result) {
        if(err)
            throw err;
        console.log("entry saved");
        onAdded();
    	});
}

function createConnection(onCreate){
    MongoClient.connect('mongodb://tuure:<tuure>@automaatio-shard-00-00.kic3u.mongodb.net:27017,automaatio-shard-00-01.kic3u.mongodb.net:27017,automaatio-shard-00-02.kic3u.mongodb.net:27017/<automaatio>?ssl=true&replicaSet=atlas-hlbr5e-shard-0&authSource=admin&retryWrites=true&w=majority', function(err, client_m) {
        db = client_m.db('automaatio'); // DB name
					if(err)
            throw err;
        console.log("connected to the mongoDB !");
        myCollection = db.collection('automaatio'); //Collection name
        onCreate();
	    client_m.close();
    });
}
