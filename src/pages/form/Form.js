import React, {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {doc, getDoc} from 'firebase/firestore';
import {projectFirestore} from '../../firebase/config';
import {getAuth} from 'firebase/auth';
import Sidebar from './Sidebar';
import ResumeForm from '../resume/edit/ResumeForm';
import InpTemp from '../resume/template/template_1/InpTemp';

function Form() {
    const navigate = useNavigate();
    const sidebarRef = useRef(null);
    const {templateId, resumeId} = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resumeData, setResumeData] = useState(null);

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
                // Fetch the specific resume document
                const resumeDocRef = doc(projectFirestore, 'resumes', resumeId);
                const resumeDoc = await getDoc(resumeDocRef);

                if (!resumeDoc.exists()) {
                    setError('Resume not found');
                    navigate('/');
                    return;
                }

                // Validate that the resume belongs to the current user
                const resumeData = resumeDoc.data();
                if (resumeData.userId !== user.email) {
                    setError('Unauthorized access');
                    navigate('/');
                    return;
                }

                setResumeData(resumeData);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching resume:', error);
                setError('Failed to load resume');
                setIsLoading(false);
            }
        };

        validateAndFetchResume();
    }, [templateId, resumeId, navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div className='text-red-600 p-4'>
                Error: {error}
                <button
                    onClick={() => navigate('/')}
                    className='ml-4 bg-blue-500 text-white px-4 py-2 rounded'
                >
                    Return to Home
                </button>
            </div>
        );
    }

    return (
        <div className='flex min-h-screen bg-gray-50 dark:bg-gray-900'>
            {/* Sidebar */}
            <div ref={sidebarRef} className='min-h-screen'>
                <Sidebar />
            </div>

            {/* Main Form Section */}
            <div className='flex-1 bg-white pl-28'>
                <ResumeForm
                    templateId={templateId}
                    resumeId={resumeId}
                    initialData={resumeData}
                />
            </div>

            {/* Preview Section */}
            <div className='flex-1 bg-white pl-28'>
                {templateId === 'template_1' && <InpTemp />}
                {/* Add conditions for other templates */}
            </div>
        </div>
    );
}

export default Form;
