import {useState, useEffect} from 'react';
import {projectAuth, projectFirestore} from '../firebase/config';
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
            // signup
            const res = await projectAuth.createUserWithEmailAndPassword(
                email,
                password,
            );

            if (!res) {
                throw new Error('Could not complete signup');
            }

            // add display name to user
            await res.user.updateProfile({displayName});

            // save user data in Firestore
            await projectFirestore.collection('users').doc(res.user.uid).set({
                email: res.user.email,
                displayName,
                createdAt: new Date(),
            });

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
        return () => setIsCancelled(true);
    }, []);

    return {signup, error, isPending};
};
