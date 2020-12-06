/* eslint-disable @typescript-eslint/no-unused-vars */
console.log('content-script init');

// FIREBASE
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



//
// const bg = browser.extension.getBackgroundPage();
// console.log('bg', bg);



// init rtdb path
let rtdbPath = '';
const host = window.location.host;
const path = window.location.pathname;
const hostFormatted = host.replaceAll('.', '*');
const pathFormatted = path.replaceAll('/', '>');
rtdbPath = `/pages/${hostFormatted}/${pathFormatted}/`;



//
let uid = '';
// let username = 'anonymous';
const getUid = async () => {
	// console.log('getUid started');


	// uid
	const gotUid: undefined | string = await browser.runtime.sendMessage({ type: 'get:uid' });
	console.log('gotUid', gotUid);
	if (gotUid) uid = gotUid;


	// username
	// const gotUsernameData = await browser.storage.local.get(['username']);
	// if (gotUsernameData && gotUsernameData.username) {
	// 	username = gotUsernameData.username;
	// 	console.log('username', username);
	// }


	if (gotUid) {
		// init presence
		const writingRef = rtdb.ref(`${rtdbPath}/${uid}`);
		rtdb.ref('.info/connected').on('value', async (snap) => {
			// If we're not currently connected, don't do anything.
			if (snap.val() == false) {
				return;
			}
			// init disconnect operation
			await writingRef.onDisconnect().remove();

			// write is online
			await writingRef.update({
				uid: uid,
				// username: username
			});
		});
	}
};
getUid(); // init



// listen for message (has to be to this specific tab id)
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.message === 'start') {
			console.log('started');
		}
	}
);



document.body.addEventListener('mousemove', async (ev) => {
	// console.log('mouse', ev);
	const x = ev.pageX;
	const y = ev.pageY;
	// const down = ev.cl

	// send data to backend for rtdb update
	await browser.runtime
		.sendMessage({
			type: 'update:pos',
			rtdbPath,
			data: {
				mousedown: false,
				x,
				y
			}
		});
	console.log('back from write');

	// if (uid) {
	// 	await rtdb.ref(`${rtdbPath}/${uid}`).update({
	// 		x,
	// 		y
	// 	});
	// }
});




// moving button
// const el = document.createElement('BUTTON');
// el.style.position = 'absolute';
// el.style.transitionDuration = '200ms';
// el.innerText = 'button!';
// document.body.appendChild(el);

// setInterval(async () => {
// 	// console.log('Hello from the content-script');

// 	el.style.top = (Math.random() * window.innerHeight) + 'px';
// 	el.style.left = (Math.random() * window.innerWidth) + 'px';

// }, 500);


