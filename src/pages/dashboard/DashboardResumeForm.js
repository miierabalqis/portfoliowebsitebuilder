import React, {useEffect, useState} from 'react';
import {doc, updateDoc} from 'firebase/firestore';
import {useNavigate} from 'react-router-dom';
import {fetchUserResumesWithTemplatesForm} from '../../firebase/helpers';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import ProfilePhotoUpload from '../../pages/resume/edit/PhotoUpload';
import {projectFirestore} from '../../firebase/config';

const DashboardResumeForm = () => {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedResume, setSelectedResume] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [editableData, setEditableData] = useState({});
    const [editableResume, setEditableResume] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const auth = getAuth();
    const user = auth.currentUser;

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
    }, [navigate]);

    const handleResumeSelect = (resume) => {
        setSelectedResume(resume);
        setEditableResume({...resume});
        setEditableData({
            ...resume,
            skills: Array.isArray(resume.skills) ? resume.skills : [],
            experience: Array.isArray(resume.experience)
                ? resume.experience
                : [],
            educationDetail: Array.isArray(resume.educationDetail)
                ? resume.educationDetail
                : [],
        });
        setCurrentStep(0);
        setIsEditing(false);
    };

    // Handle input change for fields and array-based sections
    const handleInputChange = (section, value, index, field) => {
        setEditableData((prev) => {
            const newData = {...prev};

            if (section === 'skills') {
                // Handle skills array
                const skills = Array.isArray(prev.skills)
                    ? [...prev.skills]
                    : [];
                if (typeof index === 'number') {
                    skills[index] = value;
                }
                newData.skills = skills;
            } else if (typeof index === 'number' && field) {
                // Handle array fields (experience, education, skills)
                if (!newData[section]) newData[section] = [];
                if (!newData[section][index]) newData[section][index] = {};
                newData[section][index] = {
                    ...newData[section][index],
                    [field]: value,
                };
            } else if (field) {
                // Handle nested objects (personalDetail)
                if (!newData[section]) newData[section] = {};
                newData[section][field] = value;
            } else {
                // Handle direct fields (summary, profilePhoto)
                newData[section] = value;
            }

            return newData;
        });
    };

    // const handleSubmit = async () => {
    //     if (!selectedResume || !editableResume) return;

    //     try {
    //         const resumeRef = doc(
    //             projectFirestore,
    //             'resumes',
    //             selectedResume.id,
    //         );
    //         await updateDoc(resumeRef, editableResume);
    //         alert('Resume updated successfully!');
    //         navigate('/dashboard'); // Redirect or show a success message
    //     } catch (error) {
    //         console.error('Error updating resume:', error);
    //         alert('Failed to update resume. Please try again.');
    //     }
    // };

    const handleSaveSection = async () => {
        if (!user || !selectedResume) return;
        setIsSaving(true);

        try {
            const sectionKeys = [
                'profilePhoto',
                'personalDetail',
                'summary',
                'experience',
                'educationDetail',
                'skills',
            ];
            const sectionKey = sectionKeys[currentStep];
            const resumeRef = doc(
                projectFirestore,
                'resumes',
                selectedResume.id,
            );

            // Create an update object with only the changed section
            const updateData = {
                [sectionKey]: editableData[sectionKey] || null,
            };

            // Update the document with only the changed section
            await updateDoc(resumeRef, updateData);

            // Update local state
            setSelectedResume((prev) => ({
                ...prev,
                [sectionKey]: editableData[sectionKey],
            }));

            // Update resumes list
            setResumes((prev) =>
                prev.map((resume) =>
                    resume.id === selectedResume.id
                        ? {...resume, [sectionKey]: editableData[sectionKey]}
                        : resume,
                ),
            );

            alert('Section updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving section:', error);
            alert('Failed to save section. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleNextStep = () => {
        if (currentStep < 5) {
            setCurrentStep((prevStep) => prevStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prevStep) => prevStep - 1);
        }
    };

    const renderStepContent = () => {
        if (!selectedResume) return null;

        const renderEditButton = () => (
            <div className='flex justify-end mb-4'>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className='bg-blue-500 text-white px-4 py-2 rounded'
                    >
                        Edit
                    </button>
                ) : (
                    <div className='space-x-2'>
                        <button
                            onClick={handleSaveSection}
                            disabled={isSaving}
                            className={`${
                                isSaving
                                    ? 'bg-gray-400'
                                    : 'bg-green-500 hover:bg-green-600'
                            } text-white px-4 py-2 rounded transition`}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setEditableData({...selectedResume}); // Reset to original data
                            }}
                            className='bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition'
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        );

        switch (currentStep) {
            case 0: // Profile Photo
                return (
                    <div className='profile-photo space-y-4'>
                        <h2 className='text-lg font-semibold mb-3'>
                            Profile Photo
                        </h2>
                        {renderEditButton()}

                        <div className='flex flex-col items-center space-y-4'>
                            {/* Display current profile photo if exists */}
                            {editableData.imageUrl ? (
                                <div className='relative'>
                                    <img
                                        src={editableData.imageUrl}
                                        alt='Profile'
                                        className='w-32 h-32 rounded-full object-cover'
                                    />
                                    {isEditing && (
                                        <button
                                            onClick={() => {
                                                setEditableData((prev) => ({
                                                    ...prev,
                                                    imageUrl: null,
                                                }));
                                            }}
                                            className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition'
                                            title='Remove Photo'
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className='w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center'>
                                    <span className='text-gray-400'>
                                        No Photo
                                    </span>
                                </div>
                            )}

                            {/* Photo upload section */}
                            {isEditing && (
                                <div className='w-full max-w-md'>
                                    <ProfilePhotoUpload
                                        setProfilePhoto={(downloadURL) => {
                                            setEditableData((prev) => ({
                                                ...prev,
                                                imageUrl: downloadURL,
                                            }));

                                            // Automatically save after upload
                                            const handleSave = async () => {
                                                if (!selectedResume) return;

                                                try {
                                                    setIsSaving(true);
                                                    const resumeRef = doc(
                                                        projectFirestore,
                                                        'resumes',
                                                        selectedResume.id,
                                                    );

                                                    await updateDoc(resumeRef, {
                                                        imageUrl: downloadURL,
                                                    });

                                                    setSelectedResume(
                                                        (prev) => ({
                                                            ...prev,
                                                            imageUrl:
                                                                downloadURL,
                                                        }),
                                                    );

                                                    // Update resumes list
                                                    setResumes((prev) =>
                                                        prev.map((resume) =>
                                                            resume.id ===
                                                            selectedResume.id
                                                                ? {
                                                                      ...resume,
                                                                      imageUrl:
                                                                          downloadURL,
                                                                  }
                                                                : resume,
                                                        ),
                                                    );

                                                    alert(
                                                        'Profile photo updated successfully!',
                                                    );
                                                } catch (error) {
                                                    console.error(
                                                        'Error updating profile photo:',
                                                        error,
                                                    );
                                                    alert(
                                                        'Failed to update profile photo. Please try again.',
                                                    );
                                                } finally {
                                                    setIsSaving(false);
                                                }
                                            };

                                            handleSave();
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 1: // Personal Details
                return (
                    <div className='personal-details space-y-4'>
                        <h2 className='text-lg font-semibold mb-3'>
                            Personal Details
                        </h2>
                        {renderEditButton()}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {['name', 'email', 'phone', 'address'].map(
                                (field) => (
                                    <div key={field}>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
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
                                                editableData.personalDetail?.[
                                                    field
                                                ] || ''
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'personalDetail',
                                                    e.target.value,
                                                    null,
                                                    field,
                                                )
                                            }
                                            readOnly={!isEditing}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                                                isEditing
                                                    ? 'bg-white'
                                                    : 'bg-gray-100'
                                            }`}
                                        />
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                );

            case 2: // Professional Summary
                return (
                    <div className='summary space-y-4'>
                        <h2 className='text-lg font-semibold mb-3'>
                            Professional Summary
                        </h2>
                        {renderEditButton()}
                        <textarea
                            value={editableData.summary || ''}
                            onChange={(e) =>
                                handleInputChange('summary', e.target.value)
                            }
                            readOnly={!isEditing}
                            rows={5}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                                isEditing ? 'bg-white' : 'bg-gray-100'
                            }`}
                        />
                    </div>
                );

            case 3: // Work Experience
                return (
                    <div className='experience space-y-4'>
                        <h2 className='text-lg font-semibold mb-3'>
                            Work Experience
                        </h2>
                        {renderEditButton()}
                        <div className='space-y-4'>
                            {Array.isArray(editableData.experience)
                                ? editableData.experience.map((exp, index) => (
                                      <div
                                          key={index}
                                          className='relative mb-4 p-4 border rounded-md bg-gray-50'
                                      >
                                          {isEditing && (
                                              <button
                                                  onClick={() => {
                                                      setEditableData(
                                                          (prev) => ({
                                                              ...prev,
                                                              experience:
                                                                  prev.experience.filter(
                                                                      (_, i) =>
                                                                          i !==
                                                                          index,
                                                                  ),
                                                          }),
                                                      );
                                                  }}
                                                  className='absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition'
                                                  title='Remove Experience'
                                              >
                                                  <span>×</span>
                                              </button>
                                          )}
                                          {[
                                              'company',
                                              'position',
                                              'startDate',
                                              'endDate',
                                              'description',
                                          ].map((field) => (
                                              <div key={field} className='mb-3'>
                                                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                      {field
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                          field.slice(1)}
                                                  </label>
                                                  <input
                                                      type='text'
                                                      value={exp[field] || ''}
                                                      onChange={(e) =>
                                                          handleInputChange(
                                                              'experience',
                                                              e.target.value,
                                                              index,
                                                              field,
                                                          )
                                                      }
                                                      readOnly={!isEditing}
                                                      className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                                                          isEditing
                                                              ? 'bg-white'
                                                              : 'bg-gray-100'
                                                      }`}
                                                  />
                                              </div>
                                          ))}
                                      </div>
                                  ))
                                : null}
                            {isEditing && (
                                <button
                                    onClick={() => {
                                        const newExperience = {
                                            company: '',
                                            position: '',
                                            startDate: '',
                                            endDate: '',
                                            description: '',
                                        };
                                        setEditableData((prev) => ({
                                            ...prev,
                                            experience: Array.isArray(
                                                prev.experience,
                                            )
                                                ? [
                                                      ...prev.experience,
                                                      newExperience,
                                                  ]
                                                : [newExperience],
                                        }));
                                    }}
                                    className='w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
                                >
                                    Add Experience
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 4: // Education
                return (
                    <div className='education space-y-4'>
                        <h2 className='text-lg font-semibold mb-3'>
                            Education
                        </h2>
                        {renderEditButton()}
                        <div className='space-y-4'>
                            {Array.isArray(editableData.educationDetail)
                                ? editableData.educationDetail.map(
                                      (edu, index) => (
                                          <div
                                              key={index}
                                              className='relative mb-4 p-4 border rounded-md bg-gray-50'
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
                                                      className='absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition'
                                                      title='Remove Education'
                                                  >
                                                      <span>×</span>
                                                  </button>
                                              )}
                                              {[
                                                  'institution',
                                                  'course',
                                                  'startDate',
                                                  'endDate',
                                                  'result',
                                              ].map((field) => (
                                                  <div
                                                      key={field}
                                                      className='mb-3'
                                                  >
                                                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                          {field
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                              field.slice(1)}
                                                      </label>
                                                      <input
                                                          type='text'
                                                          value={
                                                              edu[field] || ''
                                                          }
                                                          onChange={(e) =>
                                                              handleInputChange(
                                                                  'educationDetail',
                                                                  e.target
                                                                      .value,
                                                                  index,
                                                                  field,
                                                              )
                                                          }
                                                          readOnly={!isEditing}
                                                          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                                                              isEditing
                                                                  ? 'bg-white'
                                                                  : 'bg-gray-100'
                                                          }`}
                                                      />
                                                  </div>
                                              ))}
                                          </div>
                                      ),
                                  )
                                : null}
                            {isEditing && (
                                <button
                                    onClick={() => {
                                        const newEducation = {
                                            institution: '',
                                            course: '',
                                            startDate: '',
                                            endDate: '',
                                            result: '',
                                        };
                                        setEditableData((prev) => ({
                                            ...prev,
                                            educationDetail: Array.isArray(
                                                prev.educationDetail,
                                            )
                                                ? [
                                                      ...prev.educationDetail,
                                                      newEducation,
                                                  ]
                                                : [newEducation],
                                        }));
                                    }}
                                    className='w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'
                                >
                                    Add Education
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 5: // Skills
                return (
                    <div className='skills space-y-4'>
                        <h2 className='text-lg font-semibold mb-3'>Skills</h2>
                        {renderEditButton()}
                        {Array.isArray(editableData.skills) ? (
                            <div className='space-y-2'>
                                {editableData.skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className='flex gap-2 mb-2 items-center'
                                    >
                                        <input
                                            type='text'
                                            value={skill || ''}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'skills',
                                                    e.target.value,
                                                    index,
                                                )
                                            }
                                            readOnly={!isEditing}
                                            className={`flex-1 px-3 py-2 border border-gray-300 rounded-md ${
                                                isEditing
                                                    ? 'bg-white'
                                                    : 'bg-gray-100'
                                            }`}
                                        />
                                        {isEditing && (
                                            <button
                                                onClick={() => {
                                                    setEditableData((prev) => ({
                                                        ...prev,
                                                        skills: prev.skills.filter(
                                                            (_, i) =>
                                                                i !== index,
                                                        ),
                                                    }));
                                                }}
                                                className='bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition'
                                                title='Remove Skill'
                                            >
                                                <span>×</span>
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {isEditing && (
                                    <button
                                        onClick={() => {
                                            const newSkills = [
                                                ...(editableData.skills || []),
                                                '',
                                            ];
                                            setEditableData((prev) => ({
                                                ...prev,
                                                skills: newSkills,
                                            }));
                                        }}
                                        className='mt-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition'
                                    >
                                        Add Skill
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div>
                                {isEditing ? (
                                    <div>
                                        <button
                                            onClick={() => {
                                                setEditableData((prev) => ({
                                                    ...prev,
                                                    skills: [''],
                                                }));
                                            }}
                                            className='bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition'
                                        >
                                            Add First Skill
                                        </button>
                                    </div>
                                ) : (
                                    <p className='text-center text-gray-500'>
                                        No skills available.
                                    </p>
                                )}
                            </div>
                        )}
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
        <div className='bg-amber-50 text-gray-800 min-h-screen py-3 px-3'>
            <div className='p-0 sm:p-3'>
                {loading && (
                    <div className='text-center w-full'>
                        <p>Loading resumes...</p>
                    </div>
                )}

                {error && (
                    <div className='text-center w-full text-red-500'>
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && resumes.length === 0 && (
                    <div className='text-center w-full'>
                        <p>No resumes found. Create your first resume!</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className='flex flex-col'>
                        {/* Resume List Sidebar */}
                        <div className='w-full bg-white p-4 rounded-lg shadow-md mb-4'>
                            <h2 className='text-xl font-bold mb-4'>
                                Your Resumes
                            </h2>
                            {resumes.map((resume) => (
                                <div
                                    key={resume.id}
                                    onClick={() => handleResumeSelect(resume)}
                                    className={`cursor-pointer p-3 mb-2 rounded ${
                                        selectedResume?.id === resume.id
                                            ? 'bg-blue-100'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <h3 className='font-semibold'>
                                        {resume.templateName ||
                                            'Untitled Resume'}
                                    </h3>
                                    <p className='text-sm text-gray-500'>
                                        Created:{' '}
                                        {new Date(
                                            resume.createdAt.seconds * 1000,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Resume Details View */}
                        <div className='w-full bg-white p-4 rounded-lg shadow-md'>
                            {selectedResume ? (
                                <>
                                    {/* Step Navigation */}
                                    <div className='flex justify-between mb-4'>
                                        {stepLabels.map((label, index) => (
                                            <button
                                                key={label}
                                                onClick={() =>
                                                    setCurrentStep(index)
                                                }
                                                className={`px-3 py-1 rounded-md text-sm ${
                                                    currentStep === index
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 text-gray-700'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Step Content */}
                                    <div className='mt-4'>
                                        {renderStepContent()}
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className='flex justify-between mt-4'>
                                        {currentStep > 0 && (
                                            <button
                                                onClick={handlePreviousStep}
                                                className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md'
                                            >
                                                Previous
                                            </button>
                                        )}
                                        {currentStep < 5 && (
                                            <button
                                                onClick={handleNextStep}
                                                className='bg-blue-600 text-white px-4 py-2 rounded-md'
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <p className='text-center text-gray-500'>
                                    Select a resume to view details
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardResumeForm;
