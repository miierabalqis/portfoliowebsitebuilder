import React from 'react';
import ProfilePhotoUpload from '../PhotoUpload';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faArrowRight,
    faArrowLeft,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';

// Import separate section components
import PersonalDetails from '../section/PersonalDetails';
import Summary from '../section/SummaryForm';
import Experience from '../section/ExperienceForm';
import Education from '../section/EducationForm';
import {useResumeForm} from './hooks/useResumeForm';

function ResumeForm({templateId, resumeId, initialData, onUpdate}) {
    const {
        resumeData,
        currentStep,
        isUploading,
        saveStatus,
        error,
        newSkill,
        setNewSkill,
        setProfilePhoto,
        handleInputChange,
        handleArrayChange,
        addEntry,
        removeEntry,
        handleNext,
        handlePrevious,
        handleSubmit,
        addSkill,
        removeSkill,
        setCurrentStep,
    } = useResumeForm({templateId, resumeId, initialData, onUpdate});

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
                            onChange={(value) =>
                                handleInputChange('summary', 'summary', value)
                            }
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
                        <div
                            id='skill'
                            className='border-b border-gray-300 pb-6'
                        >
                            <h3 className='text-sm font-medium text-gray-900 mb-4'>
                                Skills
                            </h3>

                            <div className='mb-4 flex flex-wrap gap-2'>
                                {resumeData.skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className='bg-[#CDC1FF]/10 px-3 py-1 rounded-full flex items-center gap-2'
                                    >
                                        <span>{skill}</span>
                                        <button
                                            onClick={() => removeSkill(index)}
                                            className='text-gray-500 hover:text-red-500'
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    addSkill(newSkill);
                                }}
                                className='flex gap-2'
                            >
                                <input
                                    type='text'
                                    value={newSkill}
                                    onChange={(e) =>
                                        setNewSkill(e.target.value)
                                    }
                                    placeholder="Add a skill (e.g., 'JavaScript', 'Project Management')"
                                    className='block flex-1 px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-[#CDC1FF]'
                                />
                                <button
                                    type='submit'
                                    className='px-4 py-2 bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-white rounded-md hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300'
                                >
                                    Add
                                </button>
                            </form>
                        </div>
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
