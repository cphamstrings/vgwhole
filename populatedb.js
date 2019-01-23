var mongoDB = "mongodb://cphamstrings:cdp10409@ds263837.mlab.com:63837/vainglory"
var https = require('https');
var options = {
	protocol: "https:",
	hostname: "api.dc01.gamelockerapp.com",
	port: 443,
	path: "/shards/na/matches",
	method: "GET",
	headers: { "Accept" : "application/vnd.api+json",
		   "Authorization" : "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIzNjMwZjcwMC1iMjEzLTAxMzUtMTFiNS0wYTU4NjQ2MGE3MDciLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTExMzk2OTM0LCJwdWIiOiJzZW1jIiwidGl0bGUiOiJ2YWluZ2xvcnkiLCJhcHAiOiJ2YWluZ2xvcnl3aG9sZSIsInNjb3BlIjoiY29tbXVuaXR5IiwibGltaXQiOjEwfQ.aT3Dgug-Ie58huOcwkdwkryLRQc4sH_d1ggUElaR7Tw"
	}
};

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://cphamstrings:cdp10409@ds263837.mlab.com:63837/vainglory";

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
		var players = included.filter(function(k) {
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
			db.collection("matches").insert(item, function(err, res) {
				if (err) throw err;
				console.log("Number of documents matches: " + res.insertedCount);
				client.close();
			});
			db.collection("players").insert(players, function(err, res) {
				if (err) throw err;
				console.log("Number of players inserted: " + res.insertedCount);
				client.close();
			});
			db.collection("participants").insert(participants, function(err, res) {
				if (err) throw err;
				console.log("number of participants inserted: " + res.insertedCount);
				client.close()
			});
			db.collection("rosters").insert(rosters, function(err, res) {
				if (err) throw err;
				console.log("number of rosters insertered: " + res.insertedCount);
				client.close()
			});
		});
	});
});

req.on('error', (e) => {
	console.error(e);
});

req.end();
