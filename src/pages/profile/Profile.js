import React, {useEffect, useState} from 'react';
import {getDoc, doc} from 'firebase/firestore';
import {projectFirestore} from '../../firebase/config'; // Firebase Firestore configuration
import {useAuthContext} from '../../hooks/useAuthContext'; // Custom hook to get user context

export default function Profile() {
    const {user} = useAuthContext(); // Get the current authenticated user
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            // Fetch user data from Firestore when the user is logged in
            const userRef = doc(projectFirestore, 'users', user.uid); // Document reference in 'users' collection

            const fetchUserData = async () => {
                try {
                    const userDoc = await getDoc(userRef); // Fetch the document
                    if (userDoc.exists()) {
                        setUserProfile(userDoc.data()); // Store user data in state
                    } else {
                        console.log('No user data found!');
                    }
                } catch (error) {
                    console.error('Error fetching user data: ', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>You need to be logged in to view your profile.</div>;
    }

    return (
        <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
            <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full'>
                <h2 className='text-2xl font-bold text-gray-900'>Profile</h2>
                <div className='mt-6'>
                    <div className='text-gray-700'>
                        <strong>Name:</strong>{' '}
                        {userProfile?.displayName || 'N/A'}
                    </div>
                    <div className='text-gray-700 mt-2'>
                        <strong>Email:</strong> {userProfile?.email || 'N/A'}
                    </div>
                </div>
            </div>
        </div>
    );
}
