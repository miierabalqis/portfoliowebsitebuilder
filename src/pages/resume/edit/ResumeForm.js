import React, {useState, useEffect} from 'react';
// import {saveResumeData} from '../../../firebase/helpers';
import {projectAuth} from '../../../firebase/config';
// import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import ProfilePhotoUpload from '../../resume/edit/PhotoUpload';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {projectFirestore as db} from '../../../firebase/config';
import {useParams} from 'react-router-dom';
import {serverTimestamp} from 'firebase/firestore';

// Import separate section
// import ProfilePhoto from './section/ProfilePhoto';
import PersonalDetails from './section/PersonalDetails';
import Summary from './section/SummaryForm';
import Experience from './section/ExperienceForm';
import Education from './section/EducationForm';
import Skills from './section/Skills';

function ResumeForm() {
    const {templateId, resumeId} = useParams();
    const [saveStatus, setSaveStatus] = useState('');

    const [resumeData, setResumeData] = useState({
        profilePhoto: null,
        personalDetail: {
            name: '',
            email: '',
            phone: '',
            address: '',
        },
        summary: '',
        experience: [
            {
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                description: '',
            },
        ],
        educationDetail: [
            {
                level: '',
                institution: '',
                course: '',
                result: '',
                startDate: '',
                endDate: '',
            },
        ],
        skills: [],
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    // const [templateId, setTemplateId] = useState(null); // Store selected templateId

    // Fetch user data on component mount
    useEffect(() => {
        const fetchResumeData = async () => {
            const user = projectAuth.currentUser;
            if (!user || !templateId) return;

            try {
                const docRef = doc(
                    db,
                    'resumes',
                    templateId, //First level: templateId document
                    'userEmail', // Subcollection: userEmail
                    user.email, // Document ID: also userEmail
                );
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setResumeData((prev) => ({...prev, ...docSnap.data()}));
                } else {
                    console.log(
                        'No resume data found for the selected template.',
                    );
                }
            } catch (err) {
                console.error('Error fetching resume data:', err);
                setError('Failed to fetch resume data.');
            }
        };

        fetchResumeData();
    }, [templateId]);

    const setProfilePhoto = (url) => {
        setResumeData((prevData) => ({...prevData, profilePhoto: url}));
    };

    const handleInputChange = (section, field, value) => {
        setResumeData((prev) => ({
            ...prev,
            [section]: {...prev[section], [field]: value},
        }));
    };

    const handleArrayChange = (section, index, field, value) => {
        setResumeData((prev) => {
            const updatedArray = [...prev[section]];
            updatedArray[index] = {...updatedArray[index], [field]: value};
            return {...prev, [section]: updatedArray};
        });
    };

    const addEntry = (section) => {
        setResumeData((prevData) => ({
            ...prevData,
            [section]: [
                ...prevData[section],
                section === 'experience'
                    ? {
                          company: '',
                          position: '',
                          startDate: '',
                          endDate: '',
                          description: '',
                      }
                    : {
                          level: '',
                          institution: '',
                          course: '',
                          result: '',
                          startDate: '',
                          endDate: '',
                      },
            ],
        }));
    };

    const removeEntry = (section, index) => {
        setResumeData((prev) => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index),
        }));
    };

    // const handleSkillsChange = (e) => {
    //     const skills = e.target.value.split(',').map((skill) => skill.trim());
    //     setResumeData((prev) => ({...prev, skills}));
    // };

    // const handleEducationChange = (index, field, value) => {
    //     setResumeData((prev) => {
    //         const updatedEducation = [...prev.educationDetail];
    //         updatedEducation[index] = {
    //             ...updatedEducation[index],
    //             [field]: value,
    //         };
    //         return {...prev, educationDetail: updatedEducation};
    //     });
    // };

    const handleNext = () => {
        if (currentStep < 5) {
            setCurrentStep((prevStep) => prevStep + 1);
        }
    };

    // Navigation handlers
    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep((prevStep) => prevStep - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = projectAuth.currentUser;

        if (!user || !templateId || !resumeId) {
            setSaveStatus('error');
            setError('User not logged in or no template selected.');
            return;
        }

        setIsUploading(true);
        setSaveStatus('saving');

        try {
            // Create a reference to the specific resume document
            const docRef = doc(db, 'resumes', resumeId);

            // Prepare resume data with metadata
            const resumeDataWithMetadata = {
                ...resumeData,
                userId: user.uid, // Add user ID for querying
                userEmail: user.email, // Add user email for querying
                templateId: templateId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            // Set the document with the unique resumeId
            await setDoc(docRef, resumeDataWithMetadata);

            setSaveStatus('success');
            setTimeout(() => setSaveStatus(''), 3000); // Clear status after 3 seconds
        } catch (error) {
            console.error('Error saving resume:', error);
            setSaveStatus('error');
            setError('Failed to save resume.');
        } finally {
            setIsUploading(false);
        }
    };

    // Render save status message
    const renderSaveStatus = () => {
        switch (saveStatus) {
            case 'saving':
                return <span className='ml-2 text-gray-600'>Saving...</span>;
            case 'success':
                return (
                    <span className='ml-2 text-green-600'>
                        Resume saved successfully!
                    </span>
                );
            case 'error':
                return <span className='ml-2 text-red-600'>{error}</span>;
            default:
                return null;
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className='space-y-2'>
                        <label className='block text-sm font-medium text-gray-900'>
                            Profile Photo:{' '}
                        </label>
                        <ProfilePhotoUpload setProfilePhoto={setProfilePhoto} />
                        {resumeData.profilePhoto && (
                            <div>
                                <h4>Profile Photo:</h4>
                                <img
                                    src={resumeData.profilePhoto}
                                    alt='Profile'
                                    className='rounded-full w-32 h-32 object-cover'
                                />
                            </div>
                        )}
                    </div>
                );
            case 1:
                return (
                    <PersonalDetails
                        personalDetail={resumeData.personalDetail}
                        handleInputChange={handleInputChange}
                    />
                );
            case 2:
                return (
                    <Summary
                        summary={resumeData.summary}
                        setResumeData={setResumeData}
                    />
                );
            case 3:
                return (
                    <Experience
                        experience={resumeData.experience}
                        handleArrayChange={handleArrayChange}
                        addEntry={addEntry}
                        removeEntry={removeEntry}
                    />
                );
            case 4:
                return (
                    <Education
                        educationDetail={resumeData.educationDetail}
                        handleArrayChange={handleArrayChange}
                        addEntry={addEntry}
                        removeEntry={removeEntry}
                    />
                );
            case 5:
                return (
                    <Skills
                        skills={resumeData.skills}
                        setResumeData={setResumeData}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className='bg-white shadow-md rounded-md p-6 font-sans'>
            <h1 className='text-xl font-bold mb-4'>Resume Builder</h1>

            {renderStepContent()}

            <div className='flex justify-between mt-6'>
                {currentStep > 0 && (
                    <button
                        type='button'
                        onClick={handlePrevious}
                        className='py-2 px-4 bg-gray-500 text-white rounded-md'
                    >
                        Previous
                    </button>
                )}

                {currentStep < 5 ? (
                    <button
                        type='button'
                        onClick={handleNext}
                        className='py-2 px-4 bg-blue-600 text-white rounded-md'
                    >
                        Next
                    </button>
                ) : (
                    <div className='flex items-center space-x-2'>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <button
                                type='submit'
                                className={`px-4 py-2 rounded-md ${
                                    isUploading
                                        ? 'bg-gray-400'
                                        : 'bg-indigo-600 text-white'
                                }`}
                                disabled={isUploading}
                            >
                                {isUploading ? 'Uploading...' : 'Save Resume'}
                            </button>
                        </form>
                        {renderSaveStatus()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResumeForm;
