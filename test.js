const test = require('ava');
const winston = require('winston');
const firebase = require('firebase');
require('firebase/database');
const FirebaseLogger = require('./index');

const config = {
	apiKey: "AIzaSyAd7e_jmJ0ApbM4c3hJo-m0KuZffX6jZPU",
	authDomain: "bram-codes-tests.firebaseapp.com",
	databaseURL: "https://bram-codes-tests.firebaseio.com",
	projectId: "bram-codes-tests",
	storageBucket: "bram-codes-tests.appspot.com",
	messagingSenderId: "774386697345"
};
firebase.initializeApp(config);

const db = firebase.database();

winston.remove(winston.transports.Console);

test('simple log', t => {
	winston.add(FirebaseLogger, { ref: db.ref('logs'), key: 'key' });

	const random = Math.floor(Math.random() * 100000);
	winston.log('info', 'some message', { anything: 'This is metadata', key: random }, function (error, success) {
		t.is(success, true);
	});

	db.ref('logs/' + random).once('value', snapshot => {
		const data = snapshot.val();

		t.is(data.level, 'info');
		t.is(data.msg, 'some message');
		t.is(data.meta.anything, 'This is metadata');
		t.is(data.meta.key, random);
	});
});
