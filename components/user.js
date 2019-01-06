'use strict'

const
	request = require('request'),
	config = require('../config.json'),
	conn = require('./connection');

let con = conn.connection;

var getUserData = (sender_psid, callback) => {
	request({
		"uri": `https://graph.facebook.com/${config.GRAPH_VERSION}/${sender_psid}`,
		"qs": {
			"access_token": config.ACCESS_TOKEN
		},
		"method": "GET"
	}, (err, res, body) => {
		if (!err) {
			callback(body);
		}
	})
}

var logUserData = (sender_psid) => {
	getUserData(sender_psid, (result) => {
		console.log(result);
	})
}

var checkUserData = (sender_psid, callback) => {
	con.query(
		"SELECT * FROM user WHERE sender_id = ?",
		[
			sender_psid
		],
		(err, result, fields) => {
			if (err) throw err;
			callback(result);
		}
	)
}

module.exports = {
	checkUserData,
	logUserData
}