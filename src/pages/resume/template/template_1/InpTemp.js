import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

const InpTemp = ({data}) => {
    // Change from resume to data since that's how you're passing it
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Default resume data structure
    const defaultResumeData = {
        personalDetail: {
            name: 'John Doe',
            address: '123 Main Street, City, Country',
            phone: '123-456-7890',
            email: 'john.doe@example.com',
        },
        summary: 'This is a placeholder summary. Add your own summary here.',
        experience: [
            {
                company: 'Placeholder Company',
                position: 'Placeholder Position',
                startDate: 'Jan 2020',
                endDate: 'Present',
                description: 'Describe your role and responsibilities here.',
            },
        ],
        educationDetail: [
            {
                level: 'Placeholder Level',
                institution: 'Placeholder University',
                course: 'Placeholder Course',
                result: 'Placeholder Result',
                startDate: 'Sep 2015',
                endDate: 'Jun 2019',
            },
        ],
        skills: ['Skill 1', 'Skill 2', 'Skill 3'],
    };

    useEffect(() => {
        const updateResumeData = () => {
            try {
                if (data) {
                    // Deep merge of default and provided data
                    const mergedData = {
                        ...defaultResumeData,
                        ...data,
                        personalDetail: {
                            ...defaultResumeData.personalDetail,
                            ...(data.personalDetail || {}),
                        },
                        experience: Array.isArray(data.experience)
                            ? data.experience
                            : defaultResumeData.experience,
                        educationDetail: Array.isArray(data.educationDetail)
                            ? data.educationDetail
                            : defaultResumeData.educationDetail,
                        skills: Array.isArray(data.skills)
                            ? data.skills
                            : typeof data.skills === 'string'
                            ? data.skills
                                  .split(/[\n,]+/)
                                  .map((skill) => skill.trim())
                            : defaultResumeData.skills,
                    };
                    setResumeData(mergedData);
                } else {
                    setResumeData(defaultResumeData);
                }
            } catch (err) {
                setError('Error processing resume data');
                console.error('Error updating resume data:', err);
            } finally {
                setLoading(false);
            }
        };

        updateResumeData();
    }, [data]); // Only depend on data prop

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <p>Loading resume...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <p className='text-red-600'>{error}</p>
            </div>
        );
    }

    if (!resumeData) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <p>No resume data found</p>
            </div>
        );
    }

    return (
        <div className='bg-amber-50 text-gray-800 min-h-screen py-10 px-5'>
            <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden'>
                <div className='p-4 sm:p-6'>
                    {/* Personal Details Section */}
                    <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8'>
                        <div>
                            <h1 className='text-3xl font-bold text-gray-900'>
                                {resumeData.personalDetail?.name}
                            </h1>
                            <p className='text-gray-600 mt-1'>
                                {resumeData.personalDetail?.address}
                            </p>
                        </div>
                        <div className='text-right'>
                            <p className='text-gray-600'>
                                {resumeData.personalDetail?.phone}
                            </p>
                            <p className='text-gray-600'>
                                {resumeData.personalDetail?.email}
                            </p>
                        </div>
                    </div>

                    {/* Summary Section */}
                    {resumeData.summary && (
                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold text-gray-900 mb-3'>
                                Professional Summary
                            </h2>
                            <p className='text-gray-700 leading-relaxed'>
                                {resumeData.summary}
                            </p>
                        </div>
                    )}

                    {/* Experience Section */}
                    {Array.isArray(resumeData.experience) &&
                        resumeData.experience.length > 0 && (
                            <div className='mb-8'>
                                <h2 className='text-xl font-semibold text-gray-900 mb-3'>
                                    Work Experience
                                </h2>
                                {resumeData.experience.map((exp, index) => (
                                    <div key={index} className='mb-4'>
                                        <h3 className='text-lg font-semibold text-gray-800'>
                                            {exp.position}
                                        </h3>
                                        <p className='text-gray-600 font-medium'>
                                            {exp.company}
                                        </p>
                                        <p className='text-gray-600 text-sm'>
                                            {exp.startDate} - {exp.endDate}
                                        </p>
                                        <p className='text-gray-700 mt-2'>
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                    {/* Education Section */}
                    {Array.isArray(resumeData.educationDetail) &&
                        resumeData.educationDetail.length > 0 && (
                            <div className='mb-8'>
                                <h2 className='text-xl font-semibold text-gray-900 mb-3'>
                                    Education
                                </h2>
                                {resumeData.educationDetail.map(
                                    (edu, index) => (
                                        <div key={index} className='mb-4'>
                                            <h3 className='text-lg font-semibold text-gray-800'>
                                                {edu.institution}
                                            </h3>
                                            <p className='text-gray-600 font-medium'>
                                                {edu.course}
                                            </p>
                                            <p className='text-gray-600 text-sm'>
                                                {edu.startDate} - {edu.endDate}
                                            </p>
                                            {edu.result && (
                                                <p className='text-gray-700'>
                                                    Result: {edu.result}
                                                </p>
                                            )}
                                        </div>
                                    ),
                                )}
                            </div>
                        )}

                    {/* Skills Section */}
                    {(Array.isArray(resumeData.skills) ||
                        typeof resumeData.skills === 'string') && (
                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold text-gray-900 mb-3'>
                                Skills
                            </h2>
                            <div className='flex flex-wrap gap-2'>
                                {Array.isArray(resumeData.skills)
                                    ? resumeData.skills.map((skill, index) => (
                                          <span
                                              key={index}
                                              className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm'
                                          >
                                              {skill}
                                          </span>
                                      ))
                                    : resumeData.skills
                                          .split(/[\n,]+/)
                                          .map((skill, index) => (
                                              <span
                                                  key={index}
                                                  className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm'
                                              >
                                                  {skill.trim()}
                                              </span>
                                          ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InpTemp;
