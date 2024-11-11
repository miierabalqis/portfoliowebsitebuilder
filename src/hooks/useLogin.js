import {useState, useEffect} from 'react';
import {projectAuth, googleAuthProvider} from '../firebase/config'; // Import the Google Auth provider
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
            const res = await projectAuth.signInWithEmailAndPassword(
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
            const res = await projectAuth.signInWithPopup(googleAuthProvider);

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
