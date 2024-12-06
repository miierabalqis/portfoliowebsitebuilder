import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {doc, getDoc} from 'firebase/firestore';
import {projectFirestore} from '../../../../firebase/config';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faSpinner,
    faArrowLeft,
    faExclamationTriangle,
    faDownload,
} from '@fortawesome/free-solid-svg-icons';
import InpTemp from '../../template/template_1/InpTemp';
import {downloadResumePDF} from '../../../resume/edit/download/Download';

const Preview = () => {
    const navigate = useNavigate();
    const {templateId, resumeId} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resumeData, setResumeData] = useState(null);
    const [downloadLoading, setDownloadLoading] = useState(false);

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

                setResumeData({
                    ...resumeData,
                    id: resumeId,
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching resume:', error);
                setError('Failed to load resume');
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [templateId, resumeId, navigate]);

    const handleDownload = async () => {
        try {
            setDownloadLoading(true);
            const result = await downloadResumePDF({
                resume: resumeData,
                resumeRef: {
                    current: document.getElementById(
                        'resume-preview-container',
                    ), // Assume this is where InpTemp renders
                },
            });

            if (!result.success) {
                console.error('Download failed:', result.error);
                alert(result.error || 'Failed to download resume');
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('An unexpected error occurred during download');
        } finally {
            setDownloadLoading(false);
        }
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
                <div className='bg-white rounded-xl shadow-lg border border-[#CDC1FF]/10 p-8 max-w-md w-full text-center space-y-4'>
                    <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className='text-4xl text-red-500'
                    />
                    <h3 className='text-xl font-bold text-gray-800'>{error}</h3>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className='group bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black font-semibold px-6 py-3 rounded-full flex items-center mx-auto'
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className='mr-2' />
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-[#FBFBFB]'>
            <div className='container mx-auto px-4 py-8 pt-24'>
                <div className='relative mb-8'>
                    <div className='absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-[#CDC1FF] via-[#BFECFF] to-[#FFCCEA]'></div>
                    <div className='relative flex justify-between items-center'>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className='group flex items-center text-black hover:text-[#CDC1FF] transition-colors duration-300'
                        >
                            <FontAwesomeIcon
                                icon={faArrowLeft}
                                className='mr-2'
                            />
                            Back to Dashboard
                        </button>
                        <h2 className='text-3xl font-bold text-black'>
                            Resume Preview
                        </h2>
                        <div className='space-x-4'>
                            <button
                                onClick={handleDownload}
                                disabled={downloadLoading}
                                className={`group bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center ${
                                    downloadLoading
                                        ? 'cursor-not-allowed opacity-50'
                                        : ''
                                }`}
                            >
                                {downloadLoading ? (
                                    <>
                                        <FontAwesomeIcon
                                            icon={faSpinner}
                                            className='animate-spin mr-2'
                                        />
                                        Downloading...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon
                                            icon={faDownload}
                                            className='mr-2'
                                        />
                                        Download PDF
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className='flex justify-center'
                    id='resume-preview-container'
                >
                    <div className='max-w-4xl w-full bg-white rounded-xl shadow-lg p-8'>
                        <InpTemp resumeData={resumeData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preview;
