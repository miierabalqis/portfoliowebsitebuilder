import React, {useState} from 'react';
import {doc, getDoc} from 'firebase/firestore';
import {projectFirestore} from '../../../../firebase/config';
import {getAuth} from 'firebase/auth';
import html2pdf from 'html2pdf.js';
import ReactDOM from 'react-dom';

const ResumeDownloadButton = ({resume, resumeTemplateComponent}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const downloadResumePDF = async () => {
        // Check if resume object is passed and has an ID
        if (!resume || !resume.id) {
            setError('No resume selected');
            return;
        }

        const auth = getAuth();
        const user = auth.currentUser;

        // Additional user authentication check
        if (!user) {
            setError('Please log in to download resume');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Fetch the resume document from Firestore
            const resumeDocRef = doc(projectFirestore, 'resumes', resume.id);
            const resumeDoc = await getDoc(resumeDocRef);

            if (!resumeDoc.exists()) {
                setError('No resume found');
                return;
            }

            // Get the resume data
            const resumeData = resumeDoc.data();

            // Create a temporary div to render the resume template
            const tempDiv = document.createElement('div');
            document.body.appendChild(tempDiv);

            // Render the resume template with the data
            // This assumes you're passing a template component that can render with given data
            const templateElement = React.createElement(
                resumeTemplateComponent,
                {
                    resumeData: resumeData,
                },
            );

            // Render the template to the temporary div
            ReactDOM.render(templateElement, tempDiv);

            // PDF generation options
            const opt = {
                margin: 0.5,
                filename: `${resumeData.templateName || 'resume'}.pdf`,
                image: {type: 'jpeg', quality: 0.98},
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                },
                jsPDF: {
                    unit: 'in',
                    format: 'letter',
                    orientation: 'portrait',
                },
            };

            // Generate and download PDF
            await html2pdf().set(opt).from(tempDiv).save();

            // Clean up
            ReactDOM.unmountComponentAtNode(tempDiv);
            document.body.removeChild(tempDiv);
        } catch (err) {
            console.error('Error downloading resume PDF:', err);
            setError('Failed to download resume PDF');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed bottom-6 right-6'>
            <button
                onClick={downloadResumePDF}
                disabled={loading}
                className='w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out disabled:opacity-50'
                title='Download PDF'
            >
                {loading ? (
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

            {error && (
                <div className='fixed bottom-24 right-6 bg-red-500 text-white p-2 rounded shadow-lg'>
                    {error}
                </div>
            )}
        </div>
    );
};

export default ResumeDownloadButton;
