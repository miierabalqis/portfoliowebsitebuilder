import React, {useState, useEffect} from 'react';
import {projectAuth} from '../../../firebase/config';
import ProfilePhotoUpload from '../../resume/edit/PhotoUpload';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {projectFirestore as db} from '../../../firebase/config';
import {useParams} from 'react-router-dom';
import {serverTimestamp} from 'firebase/firestore';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faArrowRight,
    faArrowLeft,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';

// Import separate section components
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

    useEffect(() => {
        const fetchResumeData = async () => {
            const user = projectAuth.currentUser;
            if (!user || !templateId) return;

            try {
                const docRef = doc(
                    db,
                    'resumes',
                    templateId,
                    'userEmail',
                    user.email,
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

    const handleNext = () => {
        if (currentStep < 5) {
            setCurrentStep((prevStep) => prevStep + 1);
        }
    };

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
            const docRef = doc(db, 'resumes', resumeId);
            const resumeDataWithMetadata = {
                ...resumeData,
                userId: user.uid,
                userEmail: user.email,
                templateId: templateId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await setDoc(docRef, resumeDataWithMetadata);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(''), 3000);
        } catch (error) {
            console.error('Error saving resume:', error);
            setSaveStatus('error');
            setError('Failed to save resume.');
        } finally {
            setIsUploading(false);
        }
    };

    const renderSaveStatus = () => {
        switch (saveStatus) {
            case 'saving':
                return (
                    <div className='flex items-center text-[#CDC1FF]'>
                        <FontAwesomeIcon
                            icon={faSpinner}
                            className='animate-spin mr-2'
                        />
                        <span>Saving...</span>
                    </div>
                );
            case 'success':
                return (
                    <span className='text-green-500'>
                        Resume saved successfully!
                    </span>
                );
            case 'error':
                return <span className='text-red-500'>{error}</span>;
            default:
                return null;
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className='bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-6'>
                        <label className='block text-gray-700 font-medium mb-4'>
                            Profile Photo:
                        </label>
                        <ProfilePhotoUpload setProfilePhoto={setProfilePhoto} />
                        {resumeData.profilePhoto && (
                            <div className='mt-4'>
                                <h4 className='text-gray-700 mb-2'>
                                    Current Photo:
                                </h4>
                                <img
                                    src={resumeData.profilePhoto}
                                    alt='Profile'
                                    className='rounded-full w-32 h-32 object-cover border-4 border-[#CDC1FF]/20'
                                />
                            </div>
                        )}
                    </div>
                );
            case 1:
                return (
                    <div className='bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-6'>
                        <PersonalDetails
                            personalDetail={resumeData.personalDetail}
                            handleInputChange={handleInputChange}
                        />
                    </div>
                );
            case 2:
                return (
                    <div className='bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-6'>
                        <Summary
                            summary={resumeData.summary}
                            setResumeData={setResumeData}
                        />
                    </div>
                );
            case 3:
                return (
                    <div className='bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-6'>
                        <Experience
                            experience={resumeData.experience}
                            handleArrayChange={handleArrayChange}
                            addEntry={addEntry}
                            removeEntry={removeEntry}
                        />
                    </div>
                );
            case 4:
                return (
                    <div className='bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-6'>
                        <Education
                            educationDetail={resumeData.educationDetail}
                            handleArrayChange={handleArrayChange}
                            addEntry={addEntry}
                            removeEntry={removeEntry}
                        />
                    </div>
                );
            case 5:
                return (
                    <div className='bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-6'>
                        <Skills
                            skills={resumeData.skills}
                            setResumeData={setResumeData}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const sections = [
        {name: 'Photo Upload', step: 0},
        {name: 'Personal Details', step: 1},
        {name: 'Summary', step: 2},
        {name: 'Experience', step: 3},
        {name: 'Education', step: 4},
        {name: 'Skills', step: 5},
    ];

    const navigateToStep = (step) => {
        setCurrentStep(step);
    };

    return (
        <div className='max-w-4xl mx-auto p-6'>
            {/* Header */}
            <div className='text-center mb-10'>
                <div className='relative'>
                    <div className='absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-[#CDC1FF] via-[#BFECFF] to-[#FFCCEA]'></div>
                    <h1 className='relative text-3xl font-bold text-gray-800 mb-2'>
                        Build Your{' '}
                        <span className='bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] bg-clip-text text-transparent'>
                            Resume
                        </span>
                    </h1>
                </div>
            </div>

            {/* Step Progress */}
            <div className='flex justify-center mb-8'>
                <div className='flex space-x-2'>
                    {[0, 1, 2, 3, 4, 5].map((step) => (
                        <div
                            key={step}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                step === currentStep
                                    ? 'bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] transform scale-125'
                                    : step < currentStep
                                    ? 'bg-[#CDC1FF]/50'
                                    : 'bg-gray-200'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Section Navigation Bar */}
            <div className='overflow-x-auto mb-8'>
                <div className='flex justify-start space-x-2 pb-4'>
                    {sections.map((section) => (
                        <button
                            key={section.step}
                            onClick={() => navigateToStep(section.step)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300
                                ${
                                    currentStep === section.step
                                        ? 'bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-white shadow-lg'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-[#CDC1FF]/20'
                                }
                                ${
                                    currentStep > section.step
                                        ? 'hover:from-[#BFECFF] hover:to-[#FFCCEA]'
                                        : ''
                                }
                            `}
                        >
                            <span className='mr-2'>{section.step + 1}.</span>
                            {section.name}
                            {currentStep > section.step && (
                                <span className='ml-2 text-green-500'>✓</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {renderStepContent()}

            <div className='flex justify-between mt-8'>
                {currentStep > 0 && (
                    <button
                        type='button'
                        onClick={handlePrevious}
                        className='group bg-white text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 border border-[#CDC1FF]/20 transition-all duration-300 flex items-center'
                    >
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            className='mr-2 transform group-hover:-translate-x-1 transition-transform duration-300'
                        />
                        Previous
                    </button>
                )}

                {currentStep < 5 ? (
                    <button
                        type='button'
                        onClick={handleNext}
                        className='group bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black font-semibold px-6 py-3 rounded-full hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300 flex items-center ml-auto'
                    >
                        Next
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            className='ml-2 transform group-hover:translate-x-1 transition-transform duration-300'
                        />
                    </button>
                ) : (
                    <div className='ml-auto'>
                        <form onSubmit={handleSubmit}>
                            <button
                                type='submit'
                                disabled={isUploading}
                                className={`group bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-white px-8 py-3 rounded-full hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300 flex items-center ${
                                    isUploading
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                            >
                                {isUploading ? 'Saving...' : 'Save Resume'}
                            </button>
                        </form>
                        <div className='mt-2 text-center'>
                            {renderSaveStatus()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResumeForm;
