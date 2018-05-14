const test = require('ava');
const winston = require('winston');
const admin = require('firebase-admin');
const FirebaseLogger = require('./index');

const config = require('./config');

admin.initializeApp({
	credential: admin.credential.cert(config.service_account),
	databaseURL: config.databaseURL
});
const db = admin.database();

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
