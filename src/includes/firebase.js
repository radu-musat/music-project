// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyD0fuOES8ZaKLwd2uNIWEU4P4nXHnKoewM',
	authDomain: 'music-6bc61.firebaseapp.com',
	projectId: 'music-6bc61',
	storageBucket: 'music-6bc61.appspot.com',
	// messagingSenderId: '289690041644',
	appId: '1:289690041644:web:a2c33069c895a414668089',
};

// Initialize Firebase
// const app = firebase.initializeApp(firebaseConfig);
// export default app;

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

db.enablePersistence().catch(() => {
	// console.log(`Firebase persistence error ${error.code}`);
});

const usersCollection = db.collection('users');
const songsCollection = db.collection('songs');
const commentsCollection = db.collection('comments');

export default {
	auth,
	db,
	usersCollection,
	songsCollection,
	commentsCollection,
	storage,
};
