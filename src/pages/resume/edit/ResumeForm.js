import React, { useState } from 'react';
import Preview from './preview';

function ResumeForm() {
    const [resumeData, setResumeData] = useState({
        profilePhoto: null,
        personalDetail: {
            name: '',
            email: '',
            phone: '',
            address: ''
        },
        summary: '',
        experience: [
            { company: '', position: '', startDate: '', endDate: '', description: '' }
        ],
        educationDetail: [
            { institution: '', course: '', startDate: '', endDate: '' }
        ],
        skills: ''
    })

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setResumeData((prev) => ({ ...prev, profilePhoto: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (section, field, value) => {
        setResumeData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleArrayChange = (section, index, field, value) => {
        setResumeData((prev) => {
            const updatedArray = [...prev[section]];
            updatedArray[index] = { ...updatedArray[index], [field]: value };
            return { ...prev, [section]: updatedArray };
        });
    };

    const addEntry = (section) => {
        setResumeData((prevData) => ({
            ...prevData,
            [section]: [
                ...prevData[section],
                section === 'experience'
                    ? { company: '', position: '', startDate: '', endDate: '', description: '' }
                    : { institution: '', degree: '', startDate: '', endDate: '' }
            ]
        }));
    };

    // Helper function to render formatted content (bullet/numbered list) in a preview
    const renderFormattedText = (text) => {
        const lines = text.split('\n');
        const formattedLines = lines.map((line, index) => {
            if (line.startsWith("- ") || line.startsWith("* ")) {
                return <li key={index}>{line.slice(2)}</li>;
            } else if (line.match(/^\d+\./)) {
                return <li key={index}>{line.slice(line.indexOf('.') + 1).trim()}</li>;
            } else {
                return <p key={index}>{line}</p>;
            }
        });

        return <ul className="list-disc pl-5">{formattedLines}</ul>;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Resume Data:", resumeData);
    };

    return (
        <div className="flex space-x-10 p-6 font-sans">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="w-1/2 space-y-6">
                <h2 className="text-lg font-semibold">Resume Builder</h2>

                {/* Profile Photo Upload */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Profile Photo: </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                    />
                </div>

                {/* Personal Details Section */}
                <div id="personal" className="border-b border-gray-300 pb-6">
                    <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
                    <p className="text-sm text-gray-600">Use a permanent address where you can receive mail.</p>
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-900">Name:</label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={resumeData.personalDetail.name}
                            onChange={(e) => handleInputChange('personalDetail', 'name', e.target.value)}
                            className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                        />

                        <label className="block text-sm font-medium text-gray-900">Email:</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={resumeData.personalDetail.email}
                            onChange={(e) => handleInputChange('personalDetail', 'email', e.target.value)}
                            className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                        />

                        <label className="block text-sm font-medium text-gray-900">Phone:</label>
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={resumeData.personalDetail.phone}
                            onChange={(e) => handleInputChange('personalDetail', 'phone', e.target.value)}
                            className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                        />

                        <label className="block text-sm font-medium text-gray-900">Address:</label>
                        <input
                            type="text"
                            placeholder="Address"
                            value={resumeData.personalDetail.address}
                            onChange={(e) => handleInputChange('personalDetail', 'address', e.target.value)}
                            className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>
                </div>

                {/* Summary Section */}
                <div id="summary" className="border-b border-gray-300 pb-6">
                    <h3 className="text-sm font-medium text-gray-900">Summary</h3>
                    <textarea
                        placeholder="Use '-' or '*' for bullet points, or '1.', '2.' for numbered list."
                        value={resumeData.summary}
                        onChange={(e) => setResumeData((prev) => ({ ...prev, summary: e.target.value }))}
                        className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                    />
                </div>

                {/* Experience Section */}
                <div id="experience" className="border-b border-gray-300 pb-6">
                    <h3 className="text-base font-semibold text-gray-900">Experience</h3>
                    {resumeData.experience.map((exp, index) => (
                        <div key={index} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900">Company:</label>
                                <input
                                    type="text"
                                    placeholder="Company"
                                    value={exp.company}
                                    onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                                    className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900">Position:</label>
                                <input
                                    type="text"
                                    placeholder="Position"
                                    value={exp.position}
                                    onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                                    className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900">Start Date:</label>
                                <input
                                    type="date"
                                    placeholder="Start Date"
                                    value={exp.startDate}
                                    onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                                    className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900">End Date:</label>
                                <input
                                    type="date"
                                    placeholder="End Date"
                                    value={exp.endDate === 'Present' ? '' : exp.endDate}
                                    onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                                    disabled={exp.endDate === 'Present'}
                                    className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                                />
                                <div className="block text-sm font-medium text-gray-900">
                                    <input
                                        type="checkbox"
                                        onClick={() => handleArrayChange('experience', index, 'endDate', exp.endDate === 'Present' ? '' : 'Present')}
                                        checked={exp.endDate === 'Present'}
                                    />
                                    Present
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900">Description:</label>
                                <textarea
                                    placeholder="Use '-' or '*' for bullet points, or '1.', '2.' for numbered list."
                                    value={exp.description}
                                    onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                                    className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={() => addEntry('experience')} className="text-sm text-indigo-600">Add Experience</button>
                </div>

                {/* Education Section */}
                <div id="education" className="border-b border-gray-300 pb-6">
                    <h3 className="text-base font-semibold text-gray-900">Education</h3>
                    {resumeData.educationDetail.map((edu, index) => (
                        <div key={index} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900">Institution:</label>
                                <input
                                    type="text"
                                    placeholder="Institution"
                                    value={edu.institution}
                                    onChange={(e) => handleArrayChange('educationDetail', index, 'institution', e.target.value)}
                                    className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900">Course:</label>
                                <input
                                    type="text"
                                    placeholder="Course"
                                    value={edu.degree}
                                    onChange={(e) => handleArrayChange('educationDetail', index, 'course', e.target.value)}
                                    className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900">Start Date:</label>
                                <input
                                    type="date"
                                    placeholder="Start Date"
                                    value={edu.startDate}
                                    onChange={(e) => handleArrayChange('educationDetail', index, 'startDate', e.target.value)}
                                    className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900">End Date:</label>
                                <input
                                    type="date"
                                    placeholder="End Date"
                                    value={edu.endDate === 'Present' ? '' : edu.endDate}
                                    onChange={(e) => handleArrayChange('educationDetail', index, 'endDate', e.target.value)}
                                    disabled={edu.endDate === 'Present'}
                                    className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                                />
                                <div className="block text-sm font-medium text-gray-900">
                                    <input
                                        type="checkbox"
                                        onClick={() => handleArrayChange('educationDetail', index, 'endDate', edu.endDate === 'Present' ? '' : 'Present')}
                                        checked={edu.endDate === 'Present'}
                                    />
                                    Present
                                </div>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={() => addEntry('educationDetail')} className="text-sm text-indigo-600">Add Education</button>
                </div>

                {/* Skills Section */}
                <div id="skill" className="border-b border-gray-300 pb-6">
                    <h3 className="text-sm font-medium text-gray-900">Skills</h3>
                    <textarea
                        placeholder="Use '-' or '*' for bullet points, or '1.', '2.' for numbered list."
                        value={resumeData.skills}
                        onChange={(e) => setResumeData((prev) => ({ ...prev, skills: e.target.value }))}
                        className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                    />
                </div>

                <button type="submit" className="w-full px-4 py-2 mt-4 bg-indigo-600 text-white rounded-md">Save Resume</button>
            </form>

            {/* Resume Preview Section */}
            <div>
                <Preview resumeData={resumeData}  renderFormattedText={renderFormattedText} />
            </div>
        </div>
    );
}

export default ResumeForm;
