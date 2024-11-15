import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyCg3NjkzMepaqCS3d-NQg_PebHAY-IAl4U',
    authDomain: 'portfoliowebsitebuilder.firebaseapp.com',
    projectId: 'portfoliowebsitebuilder',
    storageBucket: 'portfoliowebsitebuilder.firebasestorage.app',
    messagingSenderId: '913880142322',
    appId: '1:913880142322:web:ceaa7578a7d315ca18db6b',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (Auth, Firestore)
const projectAuth = getAuth(app); // Use getAuth instead of firebase.auth()
const projectFirestore = getFirestore(app); // Use getFirestore instead of firebase.firestore()
const googleAuthProvider = new GoogleAuthProvider(); // GoogleAuthProvider from the auth module

// Export the services for use in your app
export {projectAuth, projectFirestore, googleAuthProvider};
