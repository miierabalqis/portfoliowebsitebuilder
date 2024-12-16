import React, {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {doc, getDoc} from 'firebase/firestore';
import {projectFirestore} from '../../firebase/config';
import {getAuth} from 'firebase/auth';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faSpinner,
    faHome,
    faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from './Sidebar';
import ResumeForm from '../resume/edit/form/ResumeForm';
import InpTemp from '../resume/template/template_1/InpTemp';
import InpOzidom from '../resume/template/template_2/InpOzidom';
import InpGeoffrey from '../resume/template/template_3/InpGeoffrey';

function Form() {
    const navigate = useNavigate();
    const sidebarRef = useRef(null);
    const {templateId, resumeId} = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resumeData, setResumeData] = useState(null);
    const [previewData, setPreviewData] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        const validateAndFetchResume = async () => {
            if (!user) {
                setError('User not authenticated');
                navigate('/');
                return;
            }

            if (!templateId || !resumeId) {
                setError('Missing template or resume ID');
                navigate('/');
                return;
            }

            try {
                const resumeDocRef = doc(projectFirestore, 'resumes', resumeId);
                const resumeDoc = await getDoc(resumeDocRef);

                if (!resumeDoc.exists()) {
                    setError('Resume not found');
                    navigate('/');
                    return;
                }

                const resumeData = resumeDoc.data();
                if (resumeData.userId !== user.email) {
                    setError('Unauthorized access');
                    navigate('/');
                    return;
                }

                setResumeData(resumeData);
                setPreviewData(resumeData); // Set initial preview data
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching resume:', error);
                setError('Failed to load resume');
                setIsLoading(false);
            }
        };

        validateAndFetchResume();
    }, [templateId, resumeId, navigate]);

    // Add function to update preview data
    const handleResumeUpdate = (updatedData) => {
        setPreviewData(updatedData);
    };

    if (isLoading) {
        return (
            <div className='min-h-screen bg-[#FBFBFB] flex items-center justify-center'>
                <div className='text-center'>
                    <FontAwesomeIcon
                        icon={faSpinner}
                        className='animate-spin text-4xl text-[#CDC1FF] mb-4'
                    />
                    <p className='text-gray-600'>Loading your resume...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen bg-[#FBFBFB] flex items-center justify-center'>
                <div className='bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-[#CDC1FF]/10'>
                    <div className='text-center'>
                        <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            className='text-4xl text-red-500 mb-4'
                        />
                        <h3 className='text-xl font-semibold text-gray-800 mb-4'>
                            Oops! Something went wrong
                        </h3>
                        <p className='text-gray-600 mb-6'>{error}</p>
                        <button
                            onClick={() => navigate('/')}
                            className='group bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-white px-6 py-2 rounded-full hover:from-[#BFECFF] hover:to-[#FFCCEA] transform transition-all duration-300 hover:scale-105 inline-flex items-center'
                        >
                            <FontAwesomeIcon icon={faHome} className='mr-2' />
                            Return to Home
                            <span className='ml-1 transform group-hover:translate-x-1 transition-transform duration-300'>
                                →
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-[#FBFBFB] flex'>
            {/* Sidebar */}
            {/* <div
                ref={sidebarRef}
                className='min-h-screen shadow-lg bg-white border-r border-[#CDC1FF]/10'
            >
                <Sidebar />
            </div> */}

            {/* Main Content Area */}
            <div className='flex flex-1 overflow-hidden'>
                {/* Form Section */}
                <div className='flex-1 overflow-y-auto bg-white p-6 border-r border-[#CDC1FF]/10'>
                    <div className='max-w-3xl mx-auto'>
                        {/* Form Header */}
                        <div className='mb-8'>
                            <div className='relative'>
                                <div className='absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-[#CDC1FF] via-[#BFECFF] to-[#FFCCEA]'></div>
                                <h2 className='relative text-3xl font-bold text-black mb-4'>
                                    Edit Your{' '}
                                    <span className='bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] bg-clip-text text-transparent hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300'>
                                        Resume
                                    </span>
                                </h2>
                            </div>
                        </div>

                        {/* Resume Form Component */}
                        <div className='bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-6'>
                            <ResumeForm
                                templateId={templateId}
                                resumeId={resumeId}
                                initialData={resumeData}
                                onUpdate={handleResumeUpdate}
                            />
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                <div className='flex-1 bg-gray-50 p-0 border-l border-[#CDC1FF]/10 pt-16'>
                    <div className='sticky top-6'>
                        <div className='bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-6'>
                            {templateId === 'template1' ? (
                                <InpTemp resumeData={previewData} />
                            ) : templateId === 'template2' ? (
                                <InpOzidom resumeData={previewData} />
                            ) : templateId === 'template3' ? (
                                <InpGeoffrey resumeData={previewData} />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Form;
