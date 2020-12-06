// firebase
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';

// firebase config
const config = {
	apiKey: 'AIzaSyDgZLBk6ibee-z9Ii-lZHtf7TtCgyIw3VI',
	authDomain: 'cursoring.firebaseapp.com',
	databaseURL: 'https://cursoring-default-rtdb.firebaseio.com',
	projectId: 'cursoring',
	storageBucket: 'cursoring.appspot.com',
	messagingSenderId: '659784909263',
	appId: '1:659784909263:web:943bb8ba3b398e0b13d2ba',
	measurementId: 'G-ZFDDERW432'
};
const firebaseApp = firebase.initializeApp(config); // credentials.config
const fb = firebase;
const auth = firebaseApp.auth();
const db = firebaseApp.firestore();
const rtdb = firebaseApp.database();
// console.log('firebase got', fb, auth, db, rtdb);



// uid
let uid = undefined as undefined | string;
auth.onAuthStateChanged(function (user) {
	console.log('got a user', user);
	uid = user?.uid || undefined;
});
auth.signInAnonymously();



// username
let username = '';
const initUserName = async () => {
	const gotUsernameData = await browser.storage.local.get(['username']);
	if (gotUsernameData && gotUsernameData.username) {
		username = gotUsernameData.username;
		console.log('username', username);
	}
};
initUserName();



/* eslint-disable @typescript-eslint/no-unused-vars */
browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
	console.log('background got message');
	// console.log('request', request);
	// console.log('sender', sender);

	if (request.type == 'get:uid') {
		// sendResponse(uid);
		return uid;
		// can use sendResponse or return to get info back to caller
	}
	// set username to storage
	else if (request.type == 'update:username') {
		username = request.username;
		await browser.storage.local.set({ username: username });
		return 'finished';
	}
	// update rtdb xy
	else if (request.type == 'update:pos') {
		if (uid) {
			await rtdb.ref(`${request.rtdbPath}/${uid}`).update({
				uid,
				username,
				x: request.data.x,
				y: request.data.y
			});
		} else {
			console.warn('no uid');
		}
	}
});





// setInterval(() => {
// 	console.log('Hello from the background');
// }, 2000);

