import React, {useState, useRef} from 'react';
// import { PDFExport, savePDF } from '@progress/kendo-react-pdf';
// import ReactToPdf from 'react-to-pdf';

function ResumeForm() {
    // const resumeRef = useRef(); // Reference for the resume preview section

    // Initial state structure
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
        skills: '',
    });

    // Handle profile photo upload
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setResumeData((prev) => ({
                    ...prev,
                    profilePhoto: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle input change for nested fields
    const handleInputChange = (section, field, value) => {
        setResumeData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    // Handle experience and education arrays
    const handleArrayChange = (section, index, field, value) => {
        setResumeData((prev) => {
            const updatedArray = [...prev[section]];
            updatedArray[index] = {...updatedArray[index], [field]: value};
            return {...prev, [section]: updatedArray};
        });
    };

    // Add new experience or education entry
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
                    : {institution: '', degree: '', startDate: '', endDate: ''},
            ],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Resume Data:', resumeData);
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '20px',
            }}
        >
            {/* Form Section */}
            <form
                onSubmit={handleSubmit}
                style={{width: '50%', paddingRight: '20px'}}
            >
                <h2>Resume Builder</h2>

                {/* Profile Photo Upload */}
                <div style={{marginBottom: '20px'}}>
                    <label>Profile Photo:</label>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={handlePhotoChange}
                    />
                </div>

                {/* Personal Details Section */}
                <div className='border-b border-gray-900/10 pb-12'>
                    <h2 className='text-base/7 font-semibold text-gray-900'>
                        Personal Information
                    </h2>
                    <p className='mt-1 text-sm/6 text-gray-600'>
                        Use a permanent address where you can receive mail.
                    </p>

                    <label className='block text-sm/6 font-medium text-gray-900'>
                        Name:
                        <input
                            type='text'
                            placeholder='Name'
                            value={resumeData.personalDetail.name}
                            onChange={(e) =>
                                handleInputChange(
                                    'personalDetail',
                                    'name',
                                    e.target.value,
                                )
                            }
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
                        />
                    </label>
                    <label className='block text-sm/6 font-medium text-gray-900'>
                        Email:
                        <input
                            type='email'
                            placeholder='Email'
                            value={resumeData.personalDetail.email}
                            onChange={(e) =>
                                handleInputChange(
                                    'personalDetail',
                                    'email',
                                    e.target.value,
                                )
                            }
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
                        />
                    </label>
                    <label className='block text-sm/6 font-medium text-gray-900'>
                        Phone:
                        <input
                            type='tel'
                            placeholder='Phone'
                            value={resumeData.personalDetail.phone}
                            onChange={(e) =>
                                handleInputChange(
                                    'personalDetail',
                                    'phone',
                                    e.target.value,
                                )
                            }
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
                        />
                    </label>
                    <label className='block text-sm/6 font-medium text-gray-900'>
                        Address:
                        <input
                            type='text'
                            placeholder='Address'
                            value={resumeData.personalDetail.address}
                            onChange={(e) =>
                                handleInputChange(
                                    'personalDetail',
                                    'address',
                                    e.target.value,
                                )
                            }
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
                        />
                    </label>
                </div>

                {/* Summary Section */}
                <div className='col-span-full border-b border-gray-900/10 pb-12'>
                    <h3 className='block text-sm/6 font-medium text-gray-900'>
                        Summary
                    </h3>
                    <textarea
                        placeholder='Brief summary about yourself'
                        value={resumeData.summary}
                        onChange={(e) =>
                            setResumeData((prev) => ({
                                ...prev,
                                summary: e.target.value,
                            }))
                        }
                        className='block w-full rounded-md border-0 py-1.5 text-sm/6 font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
                    />
                </div>

                {/* Experience Section */}
                <div className='border-b border-gray-900/10 pb-12'>
                    <h3 className='text-base/7 font-semibold text-gray-900'>
                        Experience
                    </h3>
                    {resumeData.experience.map((exp, index) => (
                        <div
                            key={index}
                            className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'
                        >
                            <label className='block text-sm/6 font-medium text-gray-900'>
                                Company:
                                <input
                                    type='text'
                                    placeholder='Company'
                                    value={exp.company}
                                    onChange={(e) =>
                                        handleArrayChange(
                                            'experience',
                                            index,
                                            'company',
                                            e.target.value,
                                        )
                                    }
                                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
                                />
                            </label>
                            <label className='block text-sm/6 font-medium text-gray-900'>
                                Position:
                                <input
                                    type='text'
                                    placeholder='Position'
                                    value={exp.position}
                                    onChange={(e) =>
                                        handleArrayChange(
                                            'experience',
                                            index,
                                            'position',
                                            e.target.value,
                                        )
                                    }
                                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
                                />
                            </label>
                            <label className='block text-sm/6 font-medium text-gray-900'>
                                Start Date:
                                <input
                                    type='date'
                                    placeholder='Start Date'
                                    value={exp.startDate}
                                    onChange={(e) =>
                                        handleArrayChange(
                                            'experience',
                                            index,
                                            'startDate',
                                            e.target.value,
                                        )
                                    }
                                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
                                />
                            </label>
                            <label className='block text-sm/6 font-medium text-gray-900'>
                                End Date:
                                <input
                                    type='date'
                                    placeholder='End Date'
                                    value={
                                        exp.endDate === 'Present'
                                            ? ''
                                            : exp.endDate
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
                                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
                                />
                                <input
                                    type='checkbox'
                                    onClick={() =>
                                        handleArrayChange(
                                            'experience',
                                            index,
                                            'endDate',
                                            exp.endDate === 'Present'
                                                ? ''
                                                : 'Present',
                                        )
                                    }
                                    checked={exp.endDate === 'Present'}
                                />
                                Present
                            </label>
                            <textarea
                                placeholder='Description'
                                value={exp.description}
                                onChange={(e) =>
                                    handleArrayChange(
                                        'experience',
                                        index,
                                        'description',
                                        e.target.value,
                                    )
                                }
                                className='block w-full rounded-md border-0 py-1.5 text-sm/6 font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
                            />
                        </div>
                    ))}

                    <button
                        type='button'
                        onClick={() => addEntry('experience')}
                        className='block text-sm/6 font-medium text-gray-900'
                    >
                        Add Experience
                    </button>
                </div>

                {/* Education Section */}
                <div className='border-b border-gray-900/10 pb-12'>
                    <h3 className='text-base/7 font-semibold text-gray-900'>
                        Education
                    </h3>
                    {resumeData.educationDetail.map((edu, index) => (
                        <div
                            key={index}
                            className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'
                        >
                            <label className='block text-sm/6 font-medium text-gray-900'>
                                Institution:
                                <input
                                    type='text'
                                    placeholder='Institution'
                                    value={edu.institution}
                                    onChange={(e) =>
                                        handleArrayChange(
                                            'educationDetail',
                                            index,
                                            'institution',
                                            e.target.value,
                                        )
                                    }
                                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
                                />
                            </label>
                            <label className='block text-sm/6 font-medium text-gray-900'>
                                Course:
                                <input
                                    type='text'
                                    placeholder='Course'
                                    value={edu.degree}
                                    onChange={(e) =>
                                        handleArrayChange(
                                            'educationDetail',
                                            index,
                                            'course',
                                            e.target.value,
                                        )
                                    }
                                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
                                />
                            </label>
                            <label className='block text-sm/6 font-medium text-gray-900'>
                                Start Date:
                                <input
                                    type='date'
                                    placeholder='Start Date'
                                    value={edu.startDate}
                                    onChange={(e) =>
                                        handleArrayChange(
                                            'educationDetail',
                                            index,
                                            'startDate',
                                            e.target.value,
                                        )
                                    }
                                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
                                />
                            </label>
                            <label className='block text-sm/6 font-medium text-gray-900'>
                                End Date:
                                <input
                                    type='date'
                                    placeholder='End Date'
                                    value={
                                        edu.endDate === 'Present'
                                            ? ''
                                            : edu.endDate
                                    }
                                    onChange={(e) =>
                                        handleArrayChange(
                                            'educationDetail',
                                            index,
                                            'endDate',
                                            e.target.value,
                                        )
                                    }
                                    disabled={edu.endDate === 'Present'}
                                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
                                />
                                <input
                                    type='checkbox'
                                    onClick={() =>
                                        handleArrayChange(
                                            'educationDetail',
                                            index,
                                            'endDate',
                                            edu.endDate === 'Present'
                                                ? ''
                                                : 'Present',
                                        )
                                    }
                                    checked={edu.endDate === 'Present'}
                                />
                                Present
                            </label>
                        </div>
                    ))}

                    <button
                        type='button'
                        onClick={() => addEntry('educationDetail')}
                        className='block text-sm/6 font-medium text-gray-900'
                    >
                        Add Education
                    </button>
                </div>

                {/* Skills Section */}
                <div className='border-b border-gray-900/10 pb-12'>
                    <h3 className='block text-sm/6 font-medium text-gray-900'>
                        Skills
                    </h3>
                    <textarea
                        placeholder='List your skills'
                        value={resumeData.skills}
                        onChange={(e) =>
                            setResumeData((prev) => ({
                                ...prev,
                                skills: e.target.value,
                            }))
                        }
                        className='block w-full rounded-md border-0 py-1.5 text-sm/6 font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
                    />
                </div>

                <button
                    type='submit'
                    className='block text-sm/6 font-medium text-gray-900'
                >
                    Save Resume
                </button>
            </form>

            {/* Resume Preview Section */}
            <div
                style={{
                    width: '40%',
                    border: '1px solid #ccc',
                    padding: '20px',
                    borderRadius: '8px',
                }}
                className='text-sm/6 font-medium text-gray-900'
            >
                <h2 className='text-sm/6 font-medium text-gray-900'>
                    Resume Preview
                </h2>

                {resumeData.profilePhoto && (
                    <img
                        src={resumeData.profilePhoto}
                        alt='Profile'
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginBottom: '20px',
                        }}
                    />
                )}

                <div>
                    <h3>{resumeData.personalDetail.name}</h3>
                    <p>{resumeData.personalDetail.email}</p>
                    <p>{resumeData.personalDetail.phone}</p>
                    <p>{resumeData.personalDetail.address}</p>
                </div>

                <hr style={{margin: '20px 0'}} />

                <div>
                    <h4>Summary</h4>
                    <p>{resumeData.summary}</p>
                </div>

                <hr style={{margin: '20px 0'}} />

                <div>
                    <h4>Experience</h4>
                    {resumeData.experience.map((exp, index) => (
                        <div key={index}>
                            <h4 style={{marginTop: '10px'}}>{exp.company}</h4>
                            <p>
                                <strong>Position:</strong> {exp.position}
                            </p>
                            <p>
                                <strong>Period:</strong> {exp.startDate} -{' '}
                                {exp.endDate || ''}
                            </p>
                            <p>{exp.description}</p>
                        </div>
                    ))}
                </div>

                <hr style={{margin: '20px 0'}} />

                <div>
                    <h4>Education</h4>
                    {resumeData.educationDetail.map((edu, index) => (
                        <div key={index}>
                            <h4>{edu.institution}</h4>
                            <p>
                                <strong>Course:</strong> {edu.course}
                            </p>
                            <p>
                                {edu.startDate} - {edu.endDate || ''}
                            </p>
                        </div>
                    ))}
                </div>

                <hr style={{margin: '20px 0'}} />

                <div>
                    <h4>Skills</h4>
                    <p>{resumeData.skills}</p>
                </div>

                {/* PDF Download Button */}
                {/* <ReactToPdf targetRef={resumeRef} filename="resume.pdf">
                    {({ toPdf }) => (
                        <button onClick={toPdf} style={{ marginTop: '20px', padding: '10px 20px' }}>
                            Download as PDF
                        </button>
                    )}
                </ReactToPdf> */}
            </div>
        </div>
    );
}

export default ResumeForm;
