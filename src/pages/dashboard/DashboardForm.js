import React, {useEffect, useState, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {doc, getDoc} from 'firebase/firestore';
import {projectFirestore} from '../../firebase/config';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faSpinner,
    faArrowLeft,
    faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import InpTemp from '../resume/template/template_1/InpTemp';
import DashboardResumeForm from './DashboardResumeForm';
import {downloadResumePDF} from '../resume/edit/download/Download';

const DashboardForm = () => {
    const navigate = useNavigate();
    const {templateId, resumeId} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resumeData, setResumeData] = useState(null);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const resumePreviewRef = useRef(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setError('User not authenticated');
                navigate('/login');
                return;
            }

            if (!templateId || !resumeId) {
                setError('Missing template or resume ID');
                navigate('/dashboard');
                return;
            }

            try {
                const resumeDocRef = doc(projectFirestore, 'resumes', resumeId);
                const resumeDoc = await getDoc(resumeDocRef);

                if (!resumeDoc.exists()) {
                    setError('Resume not found');
                    navigate('/dashboard');
                    return;
                }

                const resumeData = resumeDoc.data();
                if (resumeData.userId !== user.uid) {
                    setError('Unauthorized access');
                    navigate('/dashboard');
                    return;
                }

                const updatedResumeData = {
                    ...resumeData,
                    id: resumeId,
                };
                setResumeData(updatedResumeData);
                setPreviewData(updatedResumeData); // Set initial preview data
                setLoading(false);
            } catch (error) {
                console.error('Error fetching resume:', error);
                setError('Failed to load resume');
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [templateId, resumeId, navigate]);

    // Handle updates to the resume data
    const handleResumeUpdate = (updatedData) => {
        setResumeData(updatedData);
        setPreviewData(updatedData); // Update preview data when resume is updated
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-[#FBFBFB] flex items-center justify-center'>
                <div className='text-center space-y-3'>
                    <FontAwesomeIcon
                        icon={faSpinner}
                        className='animate-spin text-4xl text-[#CDC1FF]'
                    />
                    <p className='text-gray-600'>Loading your resume...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen bg-[#FBFBFB] flex items-center justify-center p-4'>
                <div className='bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-8 max-w-md w-full text-center space-y-4'>
                    <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className='text-4xl text-red-500'
                    />
                    <h3 className='text-xl font-bold text-gray-800'>{error}</h3>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className='group bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black font-semibold px-6 py-3 rounded-full hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300 flex items-center mx-auto'
                    >
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            className='mr-2 transform group-hover:-translate-x-1 transition-transform duration-300'
                        />
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const handleDownloadPDF = async () => {
        console.log('Resume Data:', resumeData);

        if (!resumeData) {
            alert('Resume data is not available');
            return;
        }

        try {
            setDownloadLoading(true);
            const result = await downloadResumePDF({
                resume: resumeData,
                // Only pass resumeRef if the download function actually requires it
                // If it doesn't, you can remove this line
                resumeRef: resumePreviewRef,
            });

            if (!result.success) {
                alert(result.error || 'Failed to download resume');
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('An unexpected error occurred during download');
        } finally {
            setDownloadLoading(false);
        }
    };

    return (
        <div className='flex min-h-screen bg-[#FBFBFB]'>
            {/* Main Content Section */}
            <div className='flex-1 px-8'>
                {/* Form Section with gradient background */}
                <div className='bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-6'>
                    <DashboardResumeForm
                        initialResumeData={resumeData}
                        onUpdate={handleResumeUpdate}
                    />
                </div>
            </div>

            {/* Preview Section */}
            <div className='flex-1 bg-gray-50 p-6 border-l border-[#CDC1FF]/10'>
                <div className='sticky top-6'>
                    <div
                        ref={resumePreviewRef} // Attach the ref here
                        className='bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-6'
                    >
                        {/* {resumeData ? <InpTemp data={previewData} /> : null} */}
                        <InpTemp resumeData={previewData} />
                        {templateId === 'template_1' && <InpTemp />}
                    </div>
                </div>
            </div>

            {/* Download Button */}
            <div className='fixed bottom-6 right-6'>
                <button
                    onClick={handleDownloadPDF}
                    disabled={downloadLoading || !resumeData}
                    className='w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out disabled:opacity-50'
                    title='Download PDF'
                >
                    {downloadLoading ? (
                        <svg
                            className='animate-spin h-8 w-8'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                        >
                            <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                            ></circle>
                            <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                        </svg>
                    ) : (
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-8 w-8'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                            />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DashboardForm;
