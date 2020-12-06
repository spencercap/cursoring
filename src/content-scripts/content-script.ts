console.log('Hello from the content-script');



const el = document.createElement('BUTTON');
el.style.position = 'absolute';
el.style.transitionDuration = '200ms';
el.innerText = 'button!';
document.body.appendChild(el);

setInterval(() => {
	// console.log('Hello from the content-script');

	el.style.top = (Math.random() * window.innerHeight) + 'px';
	el.style.left = (Math.random() * window.innerWidth) + 'px';
}, 500);



// FIREBASE
import firebase from 'firebase/app';
import 'firebase/auth';
// import 'firebase/firestore';
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
// const db = firebaseApp.firestore();
const rtdb = firebaseApp.database();

console.log('got', fb, auth, rtdb);


auth.onAuthStateChanged(function (user) {
	console.log('got a user', user);
});


auth.signInAnonymously();
