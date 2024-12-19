
#  Cre8Folio (Portfolio Website Builder)

A web application to create and manage personalized portfolio websites which features intuitive UI for adding, editing, and deleting resume components.




## Tech Stack

- ReactJS
- Tailwind
- Firebase
- Vercel
- Docker






## Features

- Choose portfolio templates
- Add, Edit, Delete Resume Sections (Education, Experience, Projects, Skills, etc)
- Realtime preview of portfolio updates
- Save and export portfolios as PDF





## Run Locally

Clone the project

```bash
  git clone https://github.com/miierabalqis/portfoliowebsitebuilder.git
```

Go to the project directory

```bash
  cd portfolio-website-builder
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

### Firebase Configuration Details

The `config.js` file initializes Firebase services such as Authentication, Firestore, and Storage. Here's a breakdown of what it includes:

1. **Firebase Initialization**: The Firebase app is initialized using `firebaseConfig`.
2. **Authentication**: Includes support for:
   - Google Sign-In via `signInWithPopup`.
   - Email/Password Sign-In via `signInWithEmailAndPassword`.
   - New User Signup via `createUserWithEmailAndPassword`.
   - Profile Updates via `updateProfile`.
3. **Firestore Database**: Set up using `getFirestore`.
4. **Storage**: Initialized with `getStorage`.

### Environment Variables

- Update the `config.js` file as shown below:
- Add the following variables, replacing the placeholders with your Firebase project configuration:

```javascript
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
```

- You can import Firebase services into your components or utilities like this

```javascript
import {
    projectAuth,
    projectFirestore,
    projectStorage,
    googleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
} from './config';

```
With this setup, Firebase will be ready to use in your project for authentication, database operations, and storage!
