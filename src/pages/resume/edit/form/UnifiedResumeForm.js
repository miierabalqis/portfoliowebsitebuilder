import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faEdit,
    faPlus,
    faSave,
    faTimes,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import ProfilePhotoUpload from '../../edit/PhotoUpload';

const UnifiedResumeForm = ({
    resumeData,
    handleInputChange,
    handleArrayChange,
    addEntry,
    removeEntry,
    handleSaveSection,
    handleNextStep,
    handlePreviousStep,
    currentStep,
    isSaving,
    isEditing,
    setIsEditing,
}) => {
    // Log currentStep and resumeData to debug
    console.log('Current Step:', currentStep);
    console.log('Resume Data:', resumeData);

    const renderEditButton = () => (
        <div className='flex justify-end mb-6'>
            {!isEditing ? (
                <button
                    onClick={() => setIsEditing(true)}
                    className='group bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black font-semibold px-6 py-3 rounded-full hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300 flex items-center'
                >
                    <FontAwesomeIcon icon={faEdit} className='mr-2' />
                    Edit Section
                </button>
            ) : (
                <div className='space-x-3'>
                    <button
                        onClick={handleSaveSection}
                        disabled={isSaving}
                        className={`group bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black font-semibold px-6 py-3 rounded-full hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300 flex items-center ${
                            isSaving ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        <FontAwesomeIcon
                            icon={isSaving ? faSpinner : faSave}
                            className={`mr-2 ${isSaving ? 'animate-spin' : ''}`}
                        />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                        className='bg-white text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 border border-[#CDC1FF]/20 transition-all duration-300 flex items-center'
                    >
                        <FontAwesomeIcon icon={faTimes} className='mr-2' />
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );

    const renderSectionContent = () => {
        const sectionStyles =
            'bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-6';
        const sectionHeaderStyles = 'text-2xl font-bold text-gray-800 mb-6';

        // Ensure currentStep is within the valid range
        if (currentStep < 0 || currentStep > 3) {
            console.error('Invalid step:', currentStep);
            return <div>Invalid Section</div>; // Display an error message
        }

        switch (currentStep) {
            case 0: // Profile Photo
                return (
                    <div className={sectionStyles}>
                        <h2 className={sectionHeaderStyles}>Profile Photo</h2>
                        {renderEditButton()}
                        <div className='flex flex-col items-center space-y-6'>
                            {resumeData.imageUrl ? (
                                <div className='relative group'>
                                    <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-[#CDC1FF]/20 transition-all duration-300 group-hover:border-[#BFECFF]/40'>
                                        <img
                                            src={resumeData.imageUrl}
                                            alt='Profile'
                                            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                                        />
                                    </div>
                                    {isEditing && (
                                        <button
                                            onClick={() =>
                                                handleInputChange(
                                                    'imageUrl',
                                                    null,
                                                )
                                            }
                                            className='absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all duration-300'
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className='w-32 h-32 rounded-full bg-gradient-to-r from-[#CDC1FF]/10 to-[#BFECFF]/10 flex items-center justify-center border-4 border-[#CDC1FF]/20'>
                                    <span className='text-gray-400'>
                                        No Photo
                                    </span>
                                </div>
                            )}
                            {isEditing && (
                                <div className='w-full max-w-md'>
                                    <ProfilePhotoUpload
                                        setProfilePhoto={handleInputChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 1: // Personal Details
                return (
                    <div className={sectionStyles}>
                        <h2 className={sectionHeaderStyles}>
                            Personal Details
                        </h2>
                        {renderEditButton()}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {['name', 'email', 'phone', 'address'].map(
                                (field) => (
                                    <div key={field} className='space-y-2'>
                                        <label className='block text-sm font-medium text-gray-700'>
                                            {field.charAt(0).toUpperCase() +
                                                field.slice(1)}
                                        </label>
                                        <input
                                            type={
                                                field === 'email'
                                                    ? 'email'
                                                    : 'text'
                                            }
                                            value={
                                                resumeData.personalDetail?.[
                                                    field
                                                ] || ''
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    field,
                                                    e.target.value,
                                                )
                                            }
                                            disabled={!isEditing}
                                            className='w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#CDC1FF] transition-all duration-300'
                                        />
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                );
            case 2: // Professional Summary
                return (
                    <div className={sectionStyles}>
                        <h2 className={sectionHeaderStyles}>
                            Professional Summary
                        </h2>
                        {renderEditButton()}
                        <textarea
                            value={resumeData.summary || ''}
                            onChange={(e) =>
                                handleInputChange('summary', e.target.value)
                            }
                            disabled={!isEditing}
                            rows={5}
                            className='w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#CDC1FF] transition-all duration-300'
                        />
                    </div>
                );
            case 3: // Work Experience
                return (
                    <div className={sectionStyles}>
                        <h2 className={sectionHeaderStyles}>Work Experience</h2>
                        {renderEditButton()}
                        <div className='space-y-6'>
                            {resumeData.experience.map((exp, index) => (
                                <div
                                    key={index}
                                    className='relative p-6 rounded-lg bg-gradient-to-r from-[#CDC1FF]/5 to-[#BFECFF]/5 border border-[#CDC1FF]/10'
                                >
                                    {isEditing && (
                                        <button
                                            onClick={() =>
                                                removeEntry('experience', index)
                                            }
                                            className='absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all duration-300'
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    )}
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        {[
                                            'company',
                                            'position',
                                            'startDate',
                                            'endDate',
                                            'description',
                                        ].map((field) => (
                                            <div
                                                key={field}
                                                className={`space-y-2 ${
                                                    field === 'description'
                                                        ? 'md:col-span-2'
                                                        : ''
                                                }`}
                                            >
                                                <label className='block text-sm font-medium text-gray-700'>
                                                    {field
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        field.slice(1)}
                                                </label>
                                                <input
                                                    type='text'
                                                    value={exp[field] || ''}
                                                    onChange={(e) =>
                                                        handleArrayChange(
                                                            'experience',
                                                            index,
                                                            field,
                                                            e.target.value,
                                                        )
                                                    }
                                                    disabled={!isEditing}
                                                    className='w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#CDC1FF] transition-all duration-300'
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => addEntry('experience')}
                                className='bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black font-semibold px-6 py-3 rounded-full hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300 flex items-center'
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className='mr-2'
                                />
                                Add Experience
                            </button>
                        </div>
                    </div>
                );
            default:
                return <div>Section not found.</div>;
        }
    };

    return (
        <div className='resume-form'>
            {renderSectionContent()}
            <div className='form-navigation mt-6 flex justify-between'>
                <button
                    onClick={handlePreviousStep}
                    disabled={currentStep === 0}
                    className='px-6 py-3 bg-gray-200 rounded-full'
                >
                    Previous
                </button>
                <button
                    onClick={handleNextStep}
                    disabled={currentStep === 4 || isSaving}
                    className='px-6 py-3 bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black font-semibold rounded-full hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300'
                >
                    Next
                </button>
                {currentStep === 4 && (
                    <button
                        onClick={handleSaveSection}
                        disabled={isSaving}
                        className='px-6 py-3 bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black font-semibold rounded-full hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300'
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default UnifiedResumeForm;
