// imports
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/functions';
import 'firebase/analytics';

// init
import credentials from './credentials';
const firebaseApp = firebase.initializeApp(credentials.config);

// exports
export const fb = firebase;
export const auth = firebaseApp.auth();
export const db = firebaseApp.firestore();
export const rtdb = firebaseApp.database();
export const functions = firebaseApp.functions();
export const analytics = firebaseApp.analytics();
