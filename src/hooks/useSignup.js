import {useState, useEffect} from 'react';
import {createUserWithEmailAndPassword} from 'firebase/auth'; // Modular import for auth
import {updateProfile} from 'firebase/auth'; // Modular import for auth
import {projectAuth} from '../firebase/config'; // Auth initialization (no change here)
import {getFirestore, collection, doc, setDoc} from 'firebase/firestore'; // Import Firestore functions
import {useAuthContext} from './useAuthContext';

export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const {dispatch} = useAuthContext();

    const signup = async (email, password, displayName) => {
        setError(null);
        setIsPending(true);

        try {
            // Signup using modular function
            const res = await createUserWithEmailAndPassword(
                projectAuth,
                email,
                password,
            );

            if (!res) {
                throw new Error('Could not complete signup');
            }

            // Add display name to user
            await updateProfile(res.user, {displayName});

            // Firestore initialization
            const db = getFirestore(); // Get the Firestore instance

            // Save user data in Firestore (modular usage)
            const userRef = doc(collection(db, 'users'), res.user.uid); // Get reference to the 'users' collection
            await setDoc(userRef, {
                email: res.user.email,
                displayName,
                createdAt: new Date(),
            });

            // Dispatch login action
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
        return () => setIsCancelled(true);
    }, []);

    return {signup, error, isPending};
};
