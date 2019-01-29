 
var mongoDB = "mongodb://cphamstrings:cdp10409@ds263837.mlab.com:63837/vainglory";
var https = require('https');
var date = new Date();
var today = date.toISOString();
var options = {
	protocol: "https:",
	hostname: "api.dc01.gamelockerapp.com",
	port: 443,
	path: "/shards/na/matches?filter[createdAt-start]=" + today,
	method: "GET",
	headers: { "Accept" : "application/vnd.api+json",
		   "Authorization" : "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIzNjMwZjcwMC1iMjEzLTAxMzUtMTFiNS0wYTU4NjQ2MGE3MDciLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTExMzk2OTM0LCJwdWIiOiJzZW1jIiwidGl0bGUiOiJ2YWluZ2xvcnkiLCJhcHAiOiJ2YWluZ2xvcnl3aG9sZSIsInNjb3BlIjoiY29tbXVuaXR5IiwibGltaXQiOjEwfQ.aT3Dgug-Ie58huOcwkdwkryLRQc4sH_d1ggUElaR7Tw"
	}
};

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://cphamstrings:cdp10409@ds263837.mlab.com:63837/vainglory";

var minutes = 5, the_interval = minutes * 60 * 1000;
setInterval(function() {


	console.log("I am doing my 5 minutes check")
	
	const req = https.request(options, (res) => {
		console.log('statusCode:', res.statusCode);
		console.log('headers:', res.headers);
		let data= '';
		res.on('data', (chunk) => {
			data += chunk;
		});

		res.on('end', () => {
			var parsed = JSON.parse(data);
			var included = parsed.included;
			var item = parsed.data;
			var player = included.filter(function(k) {
				return k.type=="player";
			});
			var participants = included.filter(function(k) {
				return k.type=="participant";
			});
			var rosters = included.filter(function(k) {
				return k.type=="roster";
			});
			MongoClient.connect(url, function(err, client) {
				if (err) throw err;
				var db = client.db('vainglory');
				item.forEach(function(element) {
					db.collection("matches").update({ id: element.id }, element, { upsert: true}, function(err, res) {
						if (err) throw err;
						client.close();
					});
				});
				player.forEach(function(element) {
					db.collection("players").update({ id: element.id }, element, { upsert: true}, function(err,res) {
						if (err) throw err;
						client.close();
					});
				});

				participants.forEach(function(element) {
					db.collection("participants").update({ id: element.id }, element, { upsert: true}, function(err,res) {
						if (err) throw err;
						client.close();
					});
				});
				rosters.forEach(function(element) {
					db.collection("rosters").update({ id: element.id }, element, { upsert: true}, function(err,res) {
						if(err) throw err;
						client.close();
					});
				});
			});
		});
	});

	req.on('error', (e) => {
		console.error(e);
	});

	req.end();
}, the_interval)

