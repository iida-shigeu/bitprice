#!/usr/bin/env node

'use strict';

var request = require('request');
var headers = {
  'Content-Type':'application/json'
};

(function() {
	var target = process.argv[2] && process.argv[2].toUpperCase() || null;
	GetBitPrice(function(err, bit) {
		if (err) {
			console.log(err);
			return
		}
		GetBitRate(target, function(err, rate) {
			if (err) {
				console.log(err);
				return;
			}
			console.log("---------------");
			console.log("BTC/JPY: " + bit + "円");
			if (rate) {
				console.log();
				console.log("BTC/" + target + ": " + rate);
				console.log(target + "/JPY: " + (rate * bit) + " 円");
			}
			console.log("---------------");
		});
	});
	
})();


function GetBitPrice(callback) {
	var opts = {
		url: 'https://coincheck.com/api/rate/btc_jpy',
		method: 'GET',
 		headers: headers,
	  	json: true
	};
	request(opts, function(err, res, body) {
		if (err) {
			return callback(err);
		}
		var p = body && body.rate || '0';
		callback(null, parseInt(p, 10));
	});
}

function GetBitRate(target, callback) {
	if (!target) {
		return callback();
	}
	var opts = {
		url: 'https://poloniex.com/public?command=returnTicker',
		method: 'GET',
 		headers: headers,
	  	json: true
	};
	request(opts, function(err, res, body) {
		if (err) {
			return callback(err);
		}
		var b = body && body['BTC_' + target] || {};
		var lowest = b['lowestAsk'] || null;
		callback(null, lowest);
	});
};