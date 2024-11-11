import firebase from 'firebase/app'; // Firebase v8.x.x
import 'firebase/auth'; // Import auth module
import 'firebase/firestore'; // Import Firestore module

const firebaseConfig = {
    apiKey: 'AIzaSyCg3NjkzMepaqCS3d-NQg_PebHAY-IAl4U',
    authDomain: 'portfoliowebsitebuilder.firebaseapp.com',
    projectId: 'portfoliowebsitebuilder',
    storageBucket: 'portfoliowebsitebuilder.firebasestorage.app',
    messagingSenderId: '913880142322',
    appId: '1:913880142322:web:ceaa7578a7d315ca18db6b',
};

firebase.initializeApp(firebaseConfig);

// Initialize services
const projectAuth = firebase.auth();
const projectFirestore = firebase.firestore();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider(); // GoogleAuthProvider for v8.x.x

export {projectAuth, projectFirestore, googleAuthProvider};
