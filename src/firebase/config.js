import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyCg3NjkzMepaqCS3d-NQg_PebHAY-IAl4U',
    authDomain: 'portfoliowebsitebuilder.firebaseapp.com',
    projectId: 'portfoliowebsitebuilder',
    storageBucket: 'portfoliowebsitebuilder.firebasestorage.app',
    messagingSenderId: '913880142322',
    appId: '1:913880142322:web:ceaa7578a7d315ca18db6b',
};

firebase.initializeApp(firebaseConfig);

//init service
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();

export {projectFirestore, projectAuth};
