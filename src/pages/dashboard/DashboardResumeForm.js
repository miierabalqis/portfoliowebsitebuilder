import React, {useEffect, memo} from 'react';
import {useNavigate} from 'react-router-dom';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {fetchUserResumesWithTemplatesForm} from '../../firebase/helpers';
import ProfilePhotoUpload from '../../pages/resume/edit/PhotoUpload';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faEdit,
    faSave,
    faArrowRight,
    faArrowLeft,
    faSpinner,
    faTimes,
    faPlus,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {useResumeDashboardForm} from './hooks/useResumeDashboardForm';
import {MemoizedInput} from './memo/MemoizedInput';
import {MemoizedTextArea} from './memo/MemoizedTextArea';
import ProfilePhotoSection from '../resume/edit/section/ProfilePhoto';

const DashboardResumeForm = ({initialResumeData}) => {
    const navigate = useNavigate();
    const {
        resumes,
        setResumes,
        loading,
        setLoading,
        error,
        setError,
        selectedResume,
        currentStep,
        setCurrentStep,
        editableData,
        setEditableData,
        isEditing,
        setIsEditing,
        isSaving,
        handleResumeSelect,
        handleInputChange,
        handleSaveSection,
        handleNextStep,
        handlePreviousStep,
        addArrayItem,
        removeArrayItem,
    } = useResumeDashboardForm(initialResumeData);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userId = user.uid;
                    const data = await fetchUserResumesWithTemplatesForm(
                        userId,
                    );
                    setResumes(data || []);

                    if (initialResumeData) {
                        const matchingResume = data.find(
                            (resume) => resume.id === initialResumeData.id,
                        );
                        if (matchingResume) {
                            handleResumeSelect(matchingResume);
                        }
                    }
                } catch (err) {
                    console.error('Error fetching resumes:', err);
                    setError('Failed to fetch resumes');
                } finally {
                    setLoading(false);
                }
            } else {
                setError('Please log in to view your resumes');
                setLoading(false);
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [
        navigate,
        initialResumeData,
        handleResumeSelect,
        setError,
        setLoading,
        setResumes,
    ]);

    // Styled input components
    const StyledInput = memo(
        ({
            type = 'text',
            value,
            onChange,
            isEditing,
            className = '',
            field,
        }) => (
            <MemoizedInput
                type={type}
                value={value}
                onChange={(newValue) => isEditing && onChange(newValue, field)}
                disabled={!isEditing}
                className={className}
                field={field}
            />
        ),
    );

    const StyledTextArea = memo(
        ({value, onChange, isEditing, rows = 5, field}) => (
            <MemoizedTextArea
                value={value}
                onChange={(newValue) => isEditing && onChange(newValue, field)}
                disabled={!isEditing}
                rows={rows}
                field={field}
            />
        ),
    );

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
                        onClick={() => {
                            setIsEditing(false);
                            setEditableData({...selectedResume});
                        }}
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

    const renderStepContent = () => {
        if (!selectedResume) return null;

        const sectionStyles =
            'bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-6';
        const sectionHeaderStyles = 'text-2xl font-bold text-gray-800 mb-6';

        switch (currentStep) {
            case 0: // Profile Photo
                return (
                    <div className={sectionStyles}>
                        <h2 className={sectionHeaderStyles}>Profile Photo</h2>
                        {renderEditButton()}

                        <div className='flex flex-col items-center space-y-6'>
                            {editableData.profilePhoto ? (
                                <div className='relative group'>
                                    <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-[#CDC1FF]/20 transition-all duration-300 group-hover:border-[#BFECFF]/40'>
                                        <img
                                            src={editableData.profilePhoto}
                                            alt='Profile'
                                            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                                        />
                                    </div>
                                    {isEditing && (
                                        <button
                                            onClick={() =>
                                                setEditableData((prev) => ({
                                                    ...prev,
                                                    profilePhoto: null,
                                                }))
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
                                        initialPhotoUrl={
                                            editableData.profilePhoto
                                        } // Pass the existing photo URL
                                        setProfilePhoto={(downloadURL) => {
                                            console.log(
                                                'Photo uploaded successfully:',
                                                downloadURL,
                                            );
                                            setEditableData((prev) => {
                                                const updatedData = {
                                                    ...prev,
                                                    profilePhoto: downloadURL,
                                                };
                                                handleSaveSection(updatedData);
                                                return updatedData;
                                            });
                                        }}
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
                                        <StyledInput
                                            type={
                                                field === 'email'
                                                    ? 'email'
                                                    : 'text'
                                            }
                                            value={
                                                editableData.personalDetail?.[
                                                    field
                                                ] || ''
                                            }
                                            onChange={(value) =>
                                                handleInputChange(
                                                    'personalDetail',
                                                    value,
                                                    null,
                                                    field,
                                                )
                                            }
                                            isEditing={isEditing}
                                            field={field}
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
                        <StyledTextArea
                            value={editableData.summary || ''}
                            onChange={(value) =>
                                handleInputChange('summary', value)
                            }
                            isEditing={isEditing}
                            rows={5}
                        />
                    </div>
                );

            case 3: // Work Experience
                return (
                    <div className={sectionStyles}>
                        <h2 className={sectionHeaderStyles}>Work Experience</h2>
                        {renderEditButton()}
                        <div className='space-y-6'>
                            {Array.isArray(editableData.experience) &&
                                editableData.experience.map((exp, index) => (
                                    <div
                                        key={index}
                                        className='relative p-6 rounded-lg bg-gradient-to-r from-[#CDC1FF]/5 to-[#BFECFF]/5 border border-[#CDC1FF]/10'
                                    >
                                        {isEditing && (
                                            <button
                                                onClick={() =>
                                                    removeArrayItem(
                                                        'experience',
                                                        index,
                                                    )
                                                }
                                                className='absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all duration-300'
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                />
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
                                                            field
                                                                .slice(1)
                                                                .replace(
                                                                    /([A-Z])/g,
                                                                    ' $1',
                                                                )}
                                                    </label>
                                                    {field === 'description' ? (
                                                        <StyledTextArea
                                                            value={
                                                                exp[field] || ''
                                                            }
                                                            onChange={(value) =>
                                                                handleInputChange(
                                                                    'experience',
                                                                    value,
                                                                    index,
                                                                    field,
                                                                )
                                                            }
                                                            isEditing={
                                                                isEditing
                                                            }
                                                            rows={3}
                                                        />
                                                    ) : (
                                                        <StyledInput
                                                            type={
                                                                field.includes(
                                                                    'Date',
                                                                )
                                                                    ? 'date'
                                                                    : 'text'
                                                            }
                                                            value={
                                                                exp[field] || ''
                                                            }
                                                            onChange={(value) =>
                                                                handleInputChange(
                                                                    'experience',
                                                                    value,
                                                                    index,
                                                                    field,
                                                                )
                                                            }
                                                            isEditing={
                                                                isEditing
                                                            }
                                                            field={field}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            {isEditing && (
                                <button
                                    onClick={() =>
                                        addArrayItem('experience', {
                                            company: '',
                                            position: '',
                                            startDate: '',
                                            endDate: '',
                                            description: '',
                                        })
                                    }
                                    className='w-full bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black font-semibold px-6 py-3 rounded-full hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300 flex items-center justify-center'
                                >
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className='mr-2'
                                    />
                                    Add Experience
                                </button>
                            )}
                        </div>
                    </div>
                );
            case 4: // Education
                return (
                    <div className={sectionStyles}>
                        <h2 className={sectionHeaderStyles}>Education</h2>
                        {renderEditButton()}
                        <div className='space-y-6'>
                            {Array.isArray(editableData.educationDetail) &&
                                editableData.educationDetail.map(
                                    (edu, index) => (
                                        <div
                                            key={index}
                                            className='relative p-6 rounded-lg bg-gradient-to-r from-[#CDC1FF]/5 to-[#BFECFF]/5 border border-[#CDC1FF]/10'
                                        >
                                            {isEditing && (
                                                <button
                                                    onClick={() => {
                                                        setEditableData(
                                                            (prev) => ({
                                                                ...prev,
                                                                educationDetail:
                                                                    prev.educationDetail.filter(
                                                                        (
                                                                            _,
                                                                            i,
                                                                        ) =>
                                                                            i !==
                                                                            index,
                                                                    ),
                                                            }),
                                                        );
                                                    }}
                                                    className='absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all duration-300'
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                </button>
                                            )}
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                                {[
                                                    'level',
                                                    'institution',
                                                    'course',
                                                    'startDate',
                                                    'endDate',
                                                    'result',
                                                ].map((field) => (
                                                    <div
                                                        key={field}
                                                        className={`space-y-2 ${
                                                            field === 'result'
                                                                ? 'md:col-span-2'
                                                                : ''
                                                        }`}
                                                    >
                                                        <label className='block text-sm font-medium text-gray-700'>
                                                            {field
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                field
                                                                    .slice(1)
                                                                    .replace(
                                                                        /([A-Z])/g,
                                                                        ' $1',
                                                                    )}
                                                        </label>
                                                        <StyledInput
                                                            type={
                                                                field.includes(
                                                                    'Date',
                                                                )
                                                                    ? 'date'
                                                                    : 'text'
                                                            }
                                                            value={
                                                                edu[field] || ''
                                                            }
                                                            onChange={(value) =>
                                                                handleInputChange(
                                                                    'educationDetail',
                                                                    value,
                                                                    index,
                                                                    field,
                                                                )
                                                            }
                                                            isEditing={
                                                                isEditing
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                )}
                            {isEditing && (
                                <button
                                    onClick={() => {
                                        setEditableData((prev) => ({
                                            ...prev,
                                            educationDetail: [
                                                ...(prev.educationDetail || []),
                                                {
                                                    level: '',
                                                    institution: '',
                                                    course: '',
                                                    startDate: '',
                                                    endDate: '',
                                                    result: '',
                                                },
                                            ],
                                        }));
                                    }}
                                    className='w-full bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black font-semibold px-6 py-3 rounded-full hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300 flex items-center justify-center'
                                >
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className='mr-2'
                                    />
                                    Add Education
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 5: // Skills
                return (
                    <div className={sectionStyles}>
                        <h2 className={sectionHeaderStyles}>Skills</h2>
                        {renderEditButton()}
                        <div className='space-y-4'>
                            {Array.isArray(editableData.skills) ? (
                                <div className='space-y-3'>
                                    {editableData.skills.map((skill, index) => (
                                        <div
                                            key={index}
                                            className='flex gap-3 items-center'
                                        >
                                            <StyledInput
                                                value={skill || ''}
                                                onChange={(value) =>
                                                    handleInputChange(
                                                        'skills',
                                                        value,
                                                        index,
                                                    )
                                                }
                                                isEditing={isEditing}
                                                className='flex-1'
                                                field={`skill-${index}`}
                                            />
                                            {isEditing && (
                                                <button
                                                    onClick={() => {
                                                        setEditableData(
                                                            (prev) => ({
                                                                ...prev,
                                                                skills: prev.skills.filter(
                                                                    (_, i) =>
                                                                        i !==
                                                                        index,
                                                                ),
                                                            }),
                                                        );
                                                    }}
                                                    className='bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all duration-300'
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {isEditing && (
                                        <button
                                            onClick={() => {
                                                setEditableData((prev) => ({
                                                    ...prev,
                                                    skills: [
                                                        ...(prev.skills || []),
                                                        '',
                                                    ],
                                                }));
                                            }}
                                            className='w-full bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black font-semibold px-6 py-3 rounded-full hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300 flex items-center justify-center'
                                        >
                                            <FontAwesomeIcon
                                                icon={faPlus}
                                                className='mr-2'
                                            />
                                            Add Skill
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className='text-center'>
                                    {isEditing ? (
                                        <button
                                            onClick={() => {
                                                setEditableData((prev) => ({
                                                    ...prev,
                                                    skills: [''],
                                                }));
                                            }}
                                            className='bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black font-semibold px-6 py-3 rounded-full hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300 flex items-center justify-center mx-auto'
                                        >
                                            <FontAwesomeIcon
                                                icon={faPlus}
                                                className='mr-2'
                                            />
                                            Add First Skill
                                        </button>
                                    ) : (
                                        <p className='text-gray-500'>
                                            No skills available.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const stepLabels = [
        'Profile Photo',
        'Personal Details',
        'Summary',
        'Experience',
        'Education',
        'Skills',
    ];

    return (
        <div className='min-h-screen bg-[#FBFBFB]'>
            <div className='container mx-auto px-4 py-16 '>
                {/* Header */}
                <div className='text-center mb-5'>
                    <div className='relative'>
                        <div className='absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-[#CDC1FF] via-[#BFECFF] to-[#FFCCEA] mb-2'></div>
                        <h1 className='relative text-3xl font-bold text-gray-800 mb-2 mt-0'>
                            Manage Your{' '}
                            <span className='bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] bg-clip-text text-transparent'>
                                Resumes
                            </span>
                        </h1>
                    </div>
                </div>

                {loading ? (
                    <div className='flex justify-center items-center py-12'>
                        <div className='animate-pulse text-[#CDC1FF] flex items-center gap-2'>
                            <FontAwesomeIcon
                                icon={faSpinner}
                                className='animate-spin'
                            />
                            <span>Loading resumes...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className='text-center text-red-500 py-8'>
                        <p>{error}</p>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className='text-center text-gray-600 py-8'>
                        <p>No resumes found. Create your first resume!</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        {/* Main Content Area */}
                        <div className='lg:col-span-3'>
                            {selectedResume ? (
                                <>
                                    {/* Step Navigation */}
                                    <div className='bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-6 mb-8'>
                                        <div className='flex justify-center mb-6'>
                                            <div className='flex space-x-2'>
                                                {[0, 1, 2, 3, 4, 5].map(
                                                    (step) => (
                                                        <div
                                                            key={step}
                                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                                step ===
                                                                currentStep
                                                                    ? 'bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] transform scale-125'
                                                                    : step <
                                                                      currentStep
                                                                    ? 'bg-[#CDC1FF]/50'
                                                                    : 'bg-gray-200'
                                                            }`}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                        <div className='overflow-x-auto'>
                                            <div className='flex gap-2 pb-4'>
                                                {stepLabels.map(
                                                    (label, index) => (
                                                        <button
                                                            key={label}
                                                            onClick={() =>
                                                                setCurrentStep(
                                                                    index,
                                                                )
                                                            }
                                                            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300
                                                            ${
                                                                currentStep ===
                                                                index
                                                                    ? 'bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black font-semibold shadow-lg'
                                                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-[#CDC1FF]/20'
                                                            }
                                                        `}
                                                        >
                                                            <span className='mr-2'>
                                                                {index + 1}.
                                                            </span>
                                                            {label}
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    {renderStepContent()}

                                    {/* Navigation Buttons */}
                                    <div className='flex justify-between mt-8'>
                                        {currentStep > 0 && (
                                            <button
                                                onClick={handlePreviousStep}
                                                className='group bg-white text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 border border-[#CDC1FF]/20 transition-all duration-300 flex items-center'
                                            >
                                                <FontAwesomeIcon
                                                    icon={faArrowLeft}
                                                    className='mr-2 transform group-hover:-translate-x-1 transition-transform duration-300'
                                                />
                                                Previous
                                            </button>
                                        )}
                                        {currentStep < 5 && (
                                            <button
                                                onClick={handleNextStep}
                                                className='group bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black font-semibold px-6 py-3 rounded-full hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300 flex items-center ml-auto'
                                            >
                                                Next
                                                <FontAwesomeIcon
                                                    icon={faArrowRight}
                                                    className='ml-2 transform group-hover:translate-x-1 transition-transform duration-300'
                                                />
                                            </button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className='bg-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#CDC1FF]/20 transition-all duration-300 border border-[#CDC1FF]/10 p-6'>
                                    <p className='text-center text-gray-500'>
                                        Select a resume from the list to view
                                        and edit details
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(DashboardResumeForm);
