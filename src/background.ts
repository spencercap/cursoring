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


let uid = '';
auth.onAuthStateChanged(function (user) {
	console.log('got a user', user);
	if (user) {
		uid = user.uid;
	}
});
auth.signInAnonymously();





/* eslint-disable @typescript-eslint/no-unused-vars */
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log('Hello from the background');
	// console.log('request', request);
	// console.log('sender', sender);

	if (request.callFunc == 'getUid') {
		sendResponse(uid);
	}

	// browser.tabs.executeScript({
	// 	file: 'content-script.js',
	// });
});





// setInterval(() => {
// 	console.log('Hello from the background');
// }, 2000);

