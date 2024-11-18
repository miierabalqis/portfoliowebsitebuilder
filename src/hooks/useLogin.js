import {useState, useEffect} from 'react';
import {
    projectAuth,
    projectFirestore,
    googleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
} from '../firebase/config'; // Import the required Firebase methods
import {useAuthContext} from './useAuthContext';

export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const {dispatch} = useAuthContext();

    // Email/password login
    const login = async (email, password) => {
        setError(null);
        setIsPending(true);

        try {
            // login with email and password
            const res = await signInWithEmailAndPassword(
                projectAuth,
                email,
                password,
            );

            // dispatch login action
            dispatch({type: 'LOGIN', payload: res.user});

            if (!isCancelled) {
                setIsPending(false);
                setError(null);
            }
        } catch (err) {
            if (!isCancelled) {
                setError(err.message);
                setIsPending(false);
            }
        }
    };

    // Google login
    const loginWithGoogle = async () => {
        setError(null);
        setIsPending(true);

        try {
            // Set the prompt parameter to force account selection
            googleAuthProvider.setCustomParameters({
                prompt: 'select_account', // Always prompt for account selection
            });

            // login with Google using popup
            const res = await signInWithPopup(projectAuth, googleAuthProvider);

            // Check if user exists in Firestore
            const userRef = projectFirestore
                .collection('users')
                .doc(res.user.uid);
            const userDoc = await userRef.get();

            // If the user does not exist in Firestore, create a new user document
            if (!userDoc.exists) {
                // Store the new user's data in Firestore
                await userRef.set({
                    email: res.user.email,
                    displayName: res.user.displayName,
                    photoURL: res.user.photoURL, // Save user's Google photo (if available)
                    createdAt: new Date(),
                });
            }

            // dispatch login action
            dispatch({type: 'LOGIN', payload: res.user});

            if (!isCancelled) {
                setIsPending(false);
                setError(null);
            }
        } catch (err) {
            if (!isCancelled) {
                setError(err.message);
                setIsPending(false);
            }
        }
    };

    useEffect(() => {
        return () => setIsCancelled(true); // Cleanup on unmount
    }, []);

    return {login, loginWithGoogle, isPending, error};
};
