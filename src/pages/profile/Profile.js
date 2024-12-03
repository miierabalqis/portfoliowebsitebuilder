import React, {useEffect, useState} from 'react';
import {getDoc, doc} from 'firebase/firestore';
import {projectFirestore} from '../../firebase/config';
import {useAuthContext} from '../../hooks/useAuthContext';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faUser,
    faEnvelope,
    faPencilAlt,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
    const {user} = useAuthContext();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const userRef = doc(projectFirestore, 'users', user.uid);

            const fetchUserData = async () => {
                try {
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        setUserProfile(userDoc.data());
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

    if (!user) {
        return (
            <div className='min-h-screen bg-[#FBFBFB] flex items-center justify-center'>
                <div className='text-center p-8 rounded-xl bg-white shadow-lg border border-[#CDC1FF]/10'>
                    <h2 className='text-xl font-semibold text-gray-800 mb-4'>
                        Access Required
                    </h2>
                    <p className='text-gray-600'>
                        You need to be logged in to view your profile.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-[#FBFBFB]'>
            <div className='container mx-auto px-4 py-16'>
                {/* Header Section */}
                <section className='text-center mb-16'>
                    <div className='relative'>
                        <div className='absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-[#CDC1FF] via-[#BFECFF] to-[#FFCCEA]'></div>
                        <h2 className='relative text-4xl md:text-5xl font-bold text-black mb-4 pt-12 hover:scale-105 transition-transform duration-300'>
                            My{' '}
                            <span className='bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] bg-clip-text text-transparent hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300'>
                                Profile
                            </span>
                        </h2>
                    </div>
                    <p className='text-gray-600 mb-8 text-lg max-w-2xl mx-auto'>
                        View and manage your personal information
                    </p>
                </section>

                {loading ? (
                    <div className='flex justify-center items-center'>
                        <div className='animate-pulse text-[#CDC1FF] flex items-center gap-2'>
                            <FontAwesomeIcon
                                icon={faSpinner}
                                className='animate-spin'
                            />
                            Loading your profile...
                        </div>
                    </div>
                ) : (
                    <div className='max-w-2xl mx-auto'>
                        <div className='bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 overflow-hidden'>
                            {/* Profile Header */}
                            <div className='bg-gradient-to-r from-[#CDC1FF]/10 via-[#BFECFF]/10 to-[#FFCCEA]/10 p-8'>
                                <div className='w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] flex items-center justify-center group hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300'>
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className='text-white text-3xl group-hover:scale-110 transition-transform duration-300'
                                    />
                                </div>
                                <h3 className='text-2xl font-bold text-center text-gray-800'>
                                    {userProfile?.displayName || 'Your Profile'}
                                </h3>
                            </div>

                            {/* Profile Details */}
                            <div className='p-8'>
                                <div className='space-y-6'>
                                    {/* Name Field */}
                                    <div className='group relative bg-gray-50 p-4 rounded-lg hover:bg-gradient-to-r hover:from-[#CDC1FF]/5 hover:to-[#BFECFF]/5 transition-colors duration-300'>
                                        <div className='flex items-center gap-3 text-gray-700'>
                                            <FontAwesomeIcon
                                                icon={faUser}
                                                className='text-[#CDC1FF] group-hover:scale-110 transition-transform duration-300'
                                            />
                                            <div>
                                                <p className='text-sm font-medium text-gray-500'>
                                                    Full Name
                                                </p>
                                                <p className='font-semibold'>
                                                    {userProfile?.displayName ||
                                                        'N/A'}
                                                </p>
                                            </div>
                                            <button className='ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                                <FontAwesomeIcon
                                                    icon={faPencilAlt}
                                                    className='text-[#CDC1FF] hover:text-[#BFECFF] transition-colors duration-300'
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className='group relative bg-gray-50 p-4 rounded-lg hover:bg-gradient-to-r hover:from-[#CDC1FF]/5 hover:to-[#BFECFF]/5 transition-colors duration-300'>
                                        <div className='flex items-center gap-3 text-gray-700'>
                                            <FontAwesomeIcon
                                                icon={faEnvelope}
                                                className='text-[#CDC1FF] group-hover:scale-110 transition-transform duration-300'
                                            />
                                            <div>
                                                <p className='text-sm font-medium text-gray-500'>
                                                    Email Address
                                                </p>
                                                <p className='font-semibold'>
                                                    {userProfile?.email ||
                                                        'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className='mt-8 flex justify-center'>
                                    <button className='group bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-[#BFECFF] hover:to-[#FFCCEA] transform transition-all duration-300 hover:scale-105 hover:shadow-lg inline-flex items-center'>
                                        Edit Profile
                                        <FontAwesomeIcon
                                            icon={faPencilAlt}
                                            className='ml-2 group-hover:translate-x-1 transition-transform duration-300'
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
