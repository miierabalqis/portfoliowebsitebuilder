import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import cv from '../../assets/images/add.png';
import resumeic from '../../assets/images/dashboard/resumeic.png';
import editname from '../../assets/images/dashboard/editname.png';
import view from '../../assets/images/dashboard/view.png';
import del from '../../assets/images/dashboard/delete.png';
import {
    fetchUserResumesWithTemplates,
    saveResumeEditName,
} from '../../firebase/helpers';
import {getAuth, onAuthStateChanged} from 'firebase/auth';

export default function Dashboard() {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userId = user.uid;
                    const data = await fetchUserResumesWithTemplates(userId);
                    setResumes(data || []);
                    setLoading(false);
                } catch (err) {
                    console.error('Error fetching resumes:', err);
                    setError('Failed to fetch resumes');
                    setLoading(false);
                }
            } else {
                setError('Please log in to view your resumes');
                setLoading(false);
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleSaveName = async (resumeId, newEditName) => {
        if (!newEditName || !resumeId) return;

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                await saveResumeEditName(resumeId, newEditName);
                const updatedResumes = resumes.map((resume) =>
                    resume.id === resumeId
                        ? {...resume, editName: newEditName}
                        : resume,
                );
                setResumes(updatedResumes);
                alert('Resume name updated successfully!');
            } else {
                console.log('User not authenticated');
            }
        } catch (error) {
            console.error('Error saving name:', error);
            alert('Failed to update resume name');
        }
    };

    const handleEditResume = (resumeId) => {
        navigate(`/form/${resumeId}`);
    };

    const handleEditClick = (templateId, resumeId) => {
        navigate(`/dashboardform/${templateId}/${resumeId}`);
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900'>
            <div className='container mx-auto py-8 space-y-10 pt-24'>
                <h2 className='text-center text-4xl font-bold text-white mb-4 hover:text-pink-500 transition-colors duration-300'>
                    My Dashboard
                </h2>

                {/* Tab Navigation */}
                <div className='mb-8 flex justify-center'>
                    <div className='flex'>
                        <button className='relative group text-lg font-semibold px-4 py-2 text-white flex items-center hover:text-pink-500 transition-colors duration-300'>
                            <img
                                className='w-5 h-5 mb-8 translate-y-[12px] mr-3 filter invert'
                                src={resumeic}
                                alt='resume tab'
                            />
                            Resumes
                            <span className='absolute bottom-0 left-0 w-full h-1 bg-transparent group-hover:bg-purple-600 transform scale-x-0 transition-all duration-300 ease-in-out group-hover:scale-x-100'></span>
                            <span className='absolute bottom-[-4px] left-0 w-[300%] h-[0.5px] bg-purple-800'></span>
                        </button>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className='p-3 flex flex-wrap gap-8 justify-center'>
                    {/* Create Resume Card */}
                    <div
                        className='max-w-sm w-[325px] px-2 py-[120px] bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 border-4 border-dotted border-purple-500 rounded-lg shadow-lg hover:cursor-pointer hover:border-pink-500 transition-all duration-300'
                        onClick={() => navigate('/home')}
                    >
                        <div className='flex flex-col justify-center py-12 items-center'>
                            <div className='flex justify-center items-center'>
                                <img
                                    className='w-10 h-10 mb-8 filter invert hover:scale-110 transition-transform duration-300'
                                    src={cv}
                                    alt='cv'
                                />
                            </div>
                            <div className='flex flex-col justify-center'>
                                <p className='text-center text-white text-lg font-semibold hover:text-pink-500 transition-colors duration-300'>
                                    Create Resume
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Loading and Error States */}
                    {loading && (
                        <div className='text-center w-full text-white'>
                            <p>Loading resumes...</p>
                        </div>
                    )}

                    {error && (
                        <div className='text-center w-full text-pink-500'>
                            <p>{error}</p>
                        </div>
                    )}

                    {/* No Resumes State */}
                    {!loading && !error && resumes.length === 0 && (
                        <div className='text-center w-full text-white'>
                            <p>No resumes found. Create your first resume!</p>
                        </div>
                    )}

                    {/* Resumes Rendering */}
                    {!loading &&
                        !error &&
                        resumes.map((resume) => (
                            <div
                                key={resume.id}
                                className='max-w-sm w-[325px] bg-white border-4 border-purple-500 rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-2'
                            >
                                <div className='flex flex-col justify-center items-center'>
                                    <div className='flex justify-center items-center w-full group relative'>
                                        <img
                                            src={resume.imageUrl}
                                            alt='Resume'
                                            className='h-[280px] w-full object-cover object-top rounded-t-lg group-hover:filter group-hover:brightness-50 transition-all duration-300 ease-in-out'
                                        />
                                        <div className='hidden group-hover:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                                            <button
                                                onClick={() =>
                                                    handleEditClick(
                                                        resume.templateId,
                                                        resume.id,
                                                    )
                                                }
                                                className='bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-500 transition-colors duration-300'
                                            >
                                                Edit Resume
                                            </button>
                                        </div>
                                    </div>

                                    <div className='p-6 w-full bg-white rounded-b-lg'>
                                        <h1 className='text-lg font-semibold mb-3 text-center text-gray-800 hover:text-purple-600 transition-colors duration-300'>
                                            {resume.templateName ||
                                                'Untitled Resume'}
                                        </h1>
                                        <p className='text-base leading-relaxed mb-5 text-center text-gray-600'>
                                            Created on:{' '}
                                            {new Date(
                                                resume.createdAt.seconds * 1000,
                                            ).toLocaleDateString()}
                                        </p>

                                        {/* Editable Input Field */}
                                        <div className='text-center mb-8 flex items-center justify-center space-x-2'>
                                            <input
                                                className='bg-gray-50 border border-purple-500 p-2 rounded-md w-4/5 text-center text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500'
                                                value={resume.editName || ''}
                                                onChange={(e) => {
                                                    const updatedResumes =
                                                        resumes.map((r) =>
                                                            r.id === resume.id
                                                                ? {
                                                                      ...r,
                                                                      editName:
                                                                          e
                                                                              .target
                                                                              .value,
                                                                  }
                                                                : r,
                                                        );
                                                    setResumes(updatedResumes);
                                                }}
                                                placeholder='Enter new name'
                                            />

                                            <div className='group relative'>
                                                <button
                                                    onClick={() =>
                                                        handleSaveName(
                                                            resume.id,
                                                            resume.editName,
                                                        )
                                                    }
                                                    className='text-purple-600 hover:text-purple-500 transition-colors duration-300'
                                                >
                                                    <img
                                                        src={editname}
                                                        alt='Edit Name'
                                                        className='w-5 h-5 hover:opacity-80 transition-opacity duration-300'
                                                    />
                                                </button>
                                                <div className='hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm py-1 px-2 rounded'>
                                                    Save Name
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex items-center justify-center space-x-8'>
                                            {/* Preview button */}
                                            <div className='group relative'>
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/preview/${resume.id}`,
                                                        )
                                                    }
                                                    className='text-purple-600 hover:text-purple-500 transition-colors duration-300'
                                                >
                                                    <img
                                                        src={view}
                                                        alt='View'
                                                        className='w-5 h-5 hover:opacity-80 transition-opacity duration-300'
                                                    />
                                                </button>
                                                <div className='hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm py-1 px-2 rounded'>
                                                    Preview
                                                </div>
                                            </div>

                                            {/* Delete button */}
                                            <div className='group relative'>
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/delete/${resume.id}`,
                                                        )
                                                    }
                                                    className='text-purple-600 hover:text-purple-500 transition-colors duration-300'
                                                >
                                                    <img
                                                        src={del}
                                                        alt='Delete'
                                                        className='w-5 h-5 hover:opacity-80 transition-opacity duration-300'
                                                    />
                                                </button>
                                                <div className='hidden group-hover:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm py-1 px-2 rounded'>
                                                    Delete
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
