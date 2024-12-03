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
import Download from '../resume/edit/download/Download';

const DashboardForm = () => {
    const navigate = useNavigate();
    const {templateId, resumeId} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resumeData, setResumeData] = useState(null);

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
                    id: resumeId, // Make sure to include the document ID
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

    return (
        <div className='flex min-h-screen bg-[#FBFBFB]'>
            {/* Main Content Section */}
            <div className='flex-1 px-8'>
                {/* Form Section with gradient background */}
                <div className='bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-6'>
                    <DashboardResumeForm
                        initialResumeData={resumeData}
                        onUpdate={setResumeData}
                    />
                </div>
            </div>

            {/* Preview Section */}
            <div className='flex-1 bg-gray-50 p-6 border-l border-[#CDC1FF]/10'>
                <div className='sticky top-6'>
                    <div className='bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-6'>
                        <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                            Preview
                        </h2>
                        <InpTemp data={resumeData} />
                    </div>
                </div>
            </div>

            <Download
                resume={resumeData}
                resumeTemplateComponent={InpTemp} // Your resume template component
            />
        </div>
    );
};

export default DashboardForm;
