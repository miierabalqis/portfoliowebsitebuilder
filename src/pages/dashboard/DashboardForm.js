import React, {useEffect, useState, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {doc, getDoc} from 'firebase/firestore';
import {projectFirestore} from '../../firebase/config';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import Sidebar from '../form/Sidebar';
import InpTemp from '../resume/template/template_1/InpTemp';
import DashboardResumeForm from './DashboardResumeForm';

const DashboardForm = () => {
    const navigate = useNavigate();
    const sidebarRef = useRef(null);
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
                // Fetch the specific resume document
                const resumeDocRef = doc(projectFirestore, 'resumes', resumeId);
                const resumeDoc = await getDoc(resumeDocRef);

                if (!resumeDoc.exists()) {
                    setError('Resume not found');
                    navigate('/dashboard');
                    return;
                }

                // Validate that the resume belongs to the current user
                const resumeData = resumeDoc.data();
                if (resumeData.userId !== user.uid) {
                    setError('Unauthorized access');
                    navigate('/dashboard');
                    return;
                }

                setResumeData(resumeData);
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
            <div className='flex justify-center items-center min-h-screen'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600'></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='text-red-600 p-4'>
                Error: {error}
                <button
                    onClick={() => navigate('/dashboard')}
                    className='ml-4 bg-blue-500 text-white px-4 py-2 rounded'
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className='flex min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div ref={sidebarRef} className='min-h-screen'>
                <Sidebar />
            </div>

            <div className='flex-1 bg-white pl-32 pt-15'>
                <DashboardResumeForm
                    resumeData={resumeData}
                    onUpdate={setResumeData}
                />
            </div>

            <div className='flex-1 bg-amber-50 pl-26 w-full md:w-1/2 bg-amber-50 p-4'>
                <InpTemp data={resumeData} />
            </div>
        </div>
    );
};

export default DashboardForm;
