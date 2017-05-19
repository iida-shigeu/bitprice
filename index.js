#!/usr/bin/env node

'use strict';

var async = require('neo-async');
var _ = require('lodash');
var request = require('request');
var headers = {
  'Content-Type':'application/json'
};

(function() {

	var targets = [];
	_.forEach(process.argv, function(value, key) {
		if (key >= 2) {
			targets.push(value.toUpperCase());
		}
	});

	GetBitPrice(function(err, bit) {
		if (err) {
			console.log(err);
			return
		}
		GetBitRate(targets, function(err, rates) {
			if (err) {
				console.log(err);
				return;
			}
			console.log("---------------");
			console.log("BTC/JPY: " + bit + "円");
			_.forEach(rates || [], function(e) {
				console.log("---------------");
				console.log("BTC/" + e.target + ": " + e.rate);
				console.log(e.target + "/JPY: " + (e.rate * bit) + " 円");
			});
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

function GetBitRate(targets, callback) {
	if (!targets || targets.length === 0) {
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
		var results = [];
		_.forEach(targets, function(target) {
			var b = body && body['BTC_' + target] || {};
			var lowest = b['lowestAsk'] || null;
			if (lowest) {
				results.push({
					target: target,
					rate: lowest
				});
			}
		});
		callback(null, results);
	});
};