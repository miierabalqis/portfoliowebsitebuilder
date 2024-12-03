import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {
    fetchUserResumesWithTemplates,
    saveResumeEditName,
} from '../../firebase/helpers';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faFile,
    faEdit,
    faEye,
    faTrash,
    faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

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

    const handleEditClick = (templateId, resumeId) => {
        navigate(`/dashboardform/${templateId}/${resumeId}`);
    };

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
                                Dashboard
                            </span>
                        </h2>
                    </div>
                    <p className='text-gray-600 mb-8 text-lg max-w-2xl mx-auto'>
                        Manage and customize your professional resumes
                    </p>
                </section>

                {/* Tab Navigation */}
                <div className='flex justify-center mb-12'>
                    <button className='relative group text-lg font-semibold px-6 py-3 text-gray-800 flex items-center hover:text-[#CDC1FF] transition-colors duration-300'>
                        <FontAwesomeIcon icon={faFile} className='mr-2' />
                        Resumes
                        <span className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] transform scale-x-0 transition-all duration-300 group-hover:scale-x-100'></span>
                    </button>
                </div>

                {/* Dashboard Content */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {/* Create Resume Card */}
                    <div
                        onClick={() => navigate('/home')}
                        className='group bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 hover:-translate-y-2 border border-[#CDC1FF]/10 cursor-pointer flex flex-col items-center justify-center min-h-[400px]'
                    >
                        <div className='w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                            <FontAwesomeIcon
                                icon={faPlus}
                                className='text-white text-2xl'
                            />
                        </div>
                        <h3 className='text-2xl font-bold text-gray-800 mb-2 group-hover:text-[#CDC1FF] transition-colors duration-300'>
                            Create Resume
                        </h3>
                        <p className='text-gray-600 text-center'>
                            Start building your professional resume
                        </p>
                    </div>

                    {/* Loading and Error States */}
                    {loading && (
                        <div className='col-span-full text-center py-12'>
                            <div className='animate-pulse text-[#CDC1FF]'>
                                Loading resumes...
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className='col-span-full text-center py-12'>
                            <div className='text-red-500'>{error}</div>
                        </div>
                    )}

                    {/* Resumes */}
                    {!loading &&
                        !error &&
                        resumes.map((resume) => (
                            <div
                                key={resume.id}
                                className='group bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 hover:-translate-y-2 border border-[#CDC1FF]/10 overflow-hidden'
                            >
                                {/* Resume Preview Image */}
                                <div className='relative overflow-hidden'>
                                    <img
                                        src={resume.imageUrl}
                                        alt='Resume Preview'
                                        className='w-full h-48 object-cover object-top transition-transform duration-500 group-hover:scale-105'
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-50 transition-opacity duration-300'></div>
                                    <button
                                        onClick={() =>
                                            handleEditClick(
                                                resume.templateId,
                                                resume.id,
                                            )
                                        }
                                        className='absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black font-semibold px-6 py-2 rounded-full hover:from-[#BFECFF] hover:to-[#FFCCEA]'
                                    >
                                        Edit Resume
                                    </button>
                                </div>

                                {/* Resume Details */}
                                <div className='p-6'>
                                    <h4 className='text-xl font-semibold text-gray-800 mb-2 group-hover:text-[#CDC1FF] transition-colors duration-300'>
                                        {resume.templateName ||
                                            'Untitled Resume'}
                                    </h4>
                                    <p className='text-gray-600 text-sm mb-4'>
                                        Created on:{' '}
                                        {new Date(
                                            resume.createdAt.seconds * 1000,
                                        ).toLocaleDateString()}
                                    </p>

                                    {/* Name Edit Section */}
                                    <div className='flex items-center gap-2 mb-6'>
                                        <input
                                            className='flex-1 bg-gray-50 border border-[#CDC1FF]/20 p-2 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CDC1FF]/50'
                                            value={resume.editName || ''}
                                            onChange={(e) => {
                                                const updatedResumes =
                                                    resumes.map((r) =>
                                                        r.id === resume.id
                                                            ? {
                                                                  ...r,
                                                                  editName:
                                                                      e.target
                                                                          .value,
                                                              }
                                                            : r,
                                                    );
                                                setResumes(updatedResumes);
                                            }}
                                            placeholder='Enter resume name'
                                        />
                                        <button
                                            onClick={() =>
                                                handleSaveName(
                                                    resume.id,
                                                    resume.editName,
                                                )
                                            }
                                            className='p-2 text-[#CDC1FF] hover:text-[#BFECFF] transition-colors duration-300'
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className='flex justify-center gap-6'>
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/preview/${resume.id}`,
                                                )
                                            }
                                            className='group flex items-center text-black hover:text-[#CDC1FF] transition-colors duration-300'
                                        >
                                            <FontAwesomeIcon
                                                icon={faEye}
                                                className='mr-2'
                                            />
                                            Preview
                                            <FontAwesomeIcon
                                                icon={faArrowRight}
                                                className='ml-1 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300'
                                            />
                                        </button>
                                        <button
                                            onClick={() =>
                                                navigate(`/delete/${resume.id}`)
                                            }
                                            className='flex items-center text-black hover:text-red-500 transition-colors duration-300'
                                        >
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className='mr-2'
                                            />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
