import React, {useState, useEffect} from 'react';
// import {saveResumeData} from '../../../firebase/helpers';
import {projectAuth, projectStorage} from '../../../firebase/config';
// import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import InpTemp from '../template/template_1/InpTemp';
import ProfilePhotoUpload from '../../resume/edit/PhotoUpload';
import {addDoc, collection} from 'firebase/firestore';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {projectFirestore as db} from '../../../firebase/config';
import {useParams} from 'react-router-dom';
import {serverTimestamp} from 'firebase/firestore'; // Ensure this points to your Firestore instance

function ResumeForm() {
    const {templateId, resumeId} = useParams();
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
            {institution: '', course: '', startDate: '', endDate: ''},
        ],
        skills: [],
    });

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
                    : {institution: '', course: '', startDate: '', endDate: ''},
            ],
        }));
    };

    const handleSkillsChange = (e) => {
        const skills = e.target.value.split(',').map((skill) => skill.trim());
        setResumeData((prev) => ({...prev, skills}));
    };

    const handleEducationChange = (index, field, value) => {
        setResumeData((prev) => {
            const updatedEducation = [...prev.educationDetail];
            updatedEducation[index] = {
                ...updatedEducation[index],
                [field]: value,
            };
            return {...prev, educationDetail: updatedEducation};
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = projectAuth.currentUser;

        if (!user || !templateId || !resumeId) {
            alert('User not logged in or no template selected.');
            return;
        }

        setIsUploading(true);

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

            alert('Resume saved successfully!');
            return resumeId;
        } catch (error) {
            console.error('Error saving resume:', error);
            alert('Failed to save resume.');
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className='flex space-x-10 p-6 font-sans'>
            <form onSubmit={handleSubmit} className='w-1/2 space-y-6'>
                <h2 className='text-lg font-semibold'>Resume Builder</h2>

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

                {/* Personal Details Section */}
                <div id='personal' className='border-b border-gray-300 pb-6'>
                    <h3 className='text-base font-semibold text-gray-900'>
                        Personal Information
                    </h3>
                    <p className='text-sm text-gray-600'>
                        Use a permanent address where you can receive mail.
                    </p>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-900'>
                                Name:
                            </label>
                            <input
                                type='text'
                                placeholder='Name'
                                value={resumeData?.personalDetail?.name || ''} // Ensure fallback
                                onChange={(e) =>
                                    handleInputChange(
                                        'personalDetail',
                                        'name',
                                        e.target.value,
                                    )
                                }
                                className='block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-900'>
                                Email:
                            </label>
                            <input
                                type='email'
                                placeholder='Email'
                                value={resumeData?.personalDetail?.email || ''} // Ensure fallback
                                onChange={(e) =>
                                    handleInputChange(
                                        'personalDetail',
                                        'email',
                                        e.target.value,
                                    )
                                }
                                className='block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-900'>
                                Phone:
                            </label>
                            <input
                                type='tel'
                                placeholder='Phone'
                                value={resumeData?.personalDetail?.phone || ''} // Ensure fallback
                                onChange={(e) =>
                                    handleInputChange(
                                        'personalDetail',
                                        'phone',
                                        e.target.value,
                                    )
                                }
                                className='block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-900'>
                                Address:
                            </label>
                            <input
                                type='text'
                                placeholder='Address'
                                value={
                                    resumeData?.personalDetail?.address || ''
                                } // Ensure fallback
                                onChange={(e) =>
                                    handleInputChange(
                                        'personalDetail',
                                        'address',
                                        e.target.value,
                                    )
                                }
                                className='block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600'
                            />
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                <div id='summary' className='border-b border-gray-300 pb-6'>
                    <h3 className='text-sm font-medium text-gray-900'>
                        Summary
                    </h3>
                    <textarea
                        placeholder="Use '-' or '*' for bullet points, or '1.', '2.' for numbered list."
                        value={resumeData?.summary || ''} // Safe access with fallback
                        onChange={(e) =>
                            setResumeData((prev) => ({
                                ...prev,
                                summary: e.target.value,
                            }))
                        }
                        className='block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600'
                    />
                </div>

                {/* Experience Section */}
                <div id='experience' className='border-b border-gray-300 pb-6'>
                    <h3 className='text-base font-semibold text-gray-900'>
                        Experience
                    </h3>
                    {resumeData?.experience?.length > 0 ? (
                        resumeData.experience.map((exp, index) => (
                            <div key={index} className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-900'>
                                        Company:
                                    </label>
                                    <input
                                        type='text'
                                        placeholder='Company'
                                        value={exp.company || ''} // Fallback to avoid undefined values
                                        onChange={(e) =>
                                            handleArrayChange(
                                                'experience',
                                                index,
                                                'company',
                                                e.target.value,
                                            )
                                        }
                                        className='block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-900'>
                                        Position:
                                    </label>
                                    <input
                                        type='text'
                                        placeholder='Position'
                                        value={exp.position || ''}
                                        onChange={(e) =>
                                            handleArrayChange(
                                                'experience',
                                                index,
                                                'position',
                                                e.target.value,
                                            )
                                        }
                                        className='block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-900'>
                                        Start Date:
                                    </label>
                                    <input
                                        type='date'
                                        placeholder='Start Date'
                                        value={exp.startDate || ''}
                                        onChange={(e) =>
                                            handleArrayChange(
                                                'experience',
                                                index,
                                                'startDate',
                                                e.target.value,
                                            )
                                        }
                                        className='block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600'
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-900'>
                                        End Date:
                                    </label>
                                    <input
                                        type='date'
                                        placeholder='End Date'
                                        value={
                                            exp.endDate === 'Present'
                                                ? ''
                                                : exp.endDate || ''
                                        }
                                        onChange={(e) =>
                                            handleArrayChange(
                                                'experience',
                                                index,
                                                'endDate',
                                                e.target.value,
                                            )
                                        }
                                        disabled={exp.endDate === 'Present'}
                                        className='block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600'
                                    />
                                    <div className='block text-sm font-medium text-gray-900'>
                                        <input
                                            type='checkbox'
                                            onClick={() =>
                                                handleArrayChange(
                                                    'experience',
                                                    index,
                                                    'endDate',
                                                    'Present',
                                                )
                                            }
                                            checked={exp.endDate === 'Present'}
                                        />
                                        Present
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-900'>
                                        Description:
                                    </label>
                                    <textarea
                                        placeholder='Description'
                                        value={exp.description || ''}
                                        onChange={(e) =>
                                            handleArrayChange(
                                                'experience',
                                                index,
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        className='block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600'
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='text-sm text-gray-600'>
                            No experience added yet.
                        </p>
                    )}
                    <button
                        type='button'
                        onClick={() => addEntry('experience')}
                        className='px-4 py-2 bg-indigo-600 text-white rounded-md mt-4'
                    >
                        Add Experience
                    </button>
                </div>

                {/* Education Section */}
                <div id='education' className='border-b border-gray-300 pb-6'>
                    <h3 className='text-base font-semibold text-gray-900'>
                        Education
                    </h3>
                    {resumeData?.educationDetail?.map((edu, index) => (
                        <div key={index} className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-900'>
                                    Institution:
                                </label>
                                <input
                                    type='text'
                                    placeholder='Institution Name'
                                    value={edu?.institution || ''} // Ensure fallback value
                                    onChange={(e) =>
                                        handleEducationChange(
                                            index,
                                            'institution',
                                            e.target.value,
                                        )
                                    }
                                    className='block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-900'>
                                    Course:
                                </label>
                                <input
                                    type='text'
                                    placeholder='Course'
                                    value={edu?.course || ''} // Ensure fallback value
                                    onChange={(e) =>
                                        handleEducationChange(
                                            index,
                                            'course',
                                            e.target.value,
                                        )
                                    }
                                    className='block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-900'>
                                    Start Date:
                                </label>
                                <input
                                    type='date'
                                    value={edu?.startDate || ''} // Ensure fallback value
                                    onChange={(e) =>
                                        handleEducationChange(
                                            index,
                                            'startDate',
                                            e.target.value,
                                        )
                                    }
                                    className='block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-900'>
                                    End Date:
                                </label>
                                <input
                                    type='date'
                                    value={edu?.endDate || ''} // Ensure fallback value
                                    onChange={(e) =>
                                        handleEducationChange(
                                            index,
                                            'endDate',
                                            e.target.value,
                                        )
                                    }
                                    className='block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600'
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type='button'
                        onClick={() => addEntry('educationDetail')} // Use the addEntry function
                        className='px-4 py-2 bg-indigo-600 text-white rounded-md mt-4'
                    >
                        Add Education
                    </button>
                </div>

                {/* Skills Section */}
                <div id='skills' className='pb-6'>
                    <h3 className='text-base font-semibold text-gray-900'>
                        Skills
                    </h3>
                    <input
                        type='text'
                        placeholder='Enter skills (separated by commas)'
                        value={resumeData?.skills?.join(', ') || ''} // Convert array to string, fallback if undefined
                        onChange={handleSkillsChange} // Use the provided handler to update skills
                        className='block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600'
                    />
                </div>

                {/* Submit Button */}
                <button
                    type='submit'
                    className={`px-4 py-2 rounded-md ${
                        isUploading ? 'bg-gray-400' : 'bg-indigo-600 text-white'
                    }`}
                    disabled={isUploading}
                >
                    {isUploading ? 'Uploading...' : 'Save Resume'}
                </button>
            </form>
            {/* Main Form Section */}
            <div className='flex-1 bg-white pl-28'>
                <InpTemp resumeData={resumeData} />
            </div>
        </div>
    );
}

export default ResumeForm;
