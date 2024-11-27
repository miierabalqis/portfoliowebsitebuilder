import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {fetchResumeData} from '../../../../firebase/helpers';
import {projectAuth} from '../../../../firebase/config';

const InpTemp = () => {
    const [resumeData, setResumeData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Default resume data (to handle missing fields gracefully)
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
                institution: 'Placeholder University',
                course: 'Placeholder Course',
                startDate: 'Sep 2015',
                endDate: 'Jun 2019',
            },
        ],
        skills: 'Skill 1, Skill 2, Skill 3',
    };

    const {templateId} = useParams();

    // Log the templateId to the console to check if it's retrieved correctly
    console.log('Template ID from Route Params:', templateId);

    useEffect(() => {
        const fetchData = async () => {
            const user = projectAuth.currentUser;

            if (!user) {
                setError('User not authenticated.');
                setLoading(false);
                return;
            }

            if (!templateId) {
                setError('Template ID not found.');
                setLoading(false);
                return;
            }

            try {
                // Fetch resume data using userEmail and templateId
                const data = await fetchResumeData(user.email, templateId);
                setResumeData(data || defaultResumeData);
            } catch (err) {
                console.error('Error fetching resume data:', err);
                setError('Failed to fetch resume data. Using default data.');
                setResumeData(defaultResumeData);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [templateId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className='text-red-600'>{error}</p>;

    const {
        personalDetail = defaultResumeData.personalDetail,
        summary = defaultResumeData.summary,
        experience = defaultResumeData.experience,
        educationDetail = defaultResumeData.educationDetail,
        skills = defaultResumeData.skills,
    } = resumeData;

    return (
        <div className='bg-gray-100 text-gray-800 min-h-screen py-10 px-5'>
            <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden'>
                <div className='p-4 sm:p-6'>
                    {/* Render Personal Details */}
                    <div className='flex items-center justify-between'>
                        <div>
                            <h2 className='text-2xl font-semibold'>
                                {personalDetail.name}
                            </h2>
                            <p className='text-sm text-gray-600'>
                                {personalDetail.address}
                            </p>
                        </div>
                        <div>
                            <p className='text-sm text-gray-600'>
                                Phone: {personalDetail.phone}
                            </p>
                            <p className='text-sm text-gray-600'>
                                Email: {personalDetail.email}
                            </p>
                        </div>
                    </div>
                    <hr className='my-4' />

                    {/* Render Summary */}
                    {summary && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>
                                Summary
                            </h3>
                            <p className='text-sm leading-relaxed'>{summary}</p>
                        </div>
                    )}

                    {/* Render Experience */}
                    {experience.length > 0 && (
                        <div className='mt-4'>
                            <h3 className='text-lg font-semibold mb-2'>
                                Experience
                            </h3>
                            {experience.map((job, index) => (
                                <div key={index} className='mt-4'>
                                    <h4 className='text-md font-semibold'>
                                        {job.company}
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        {job.position} | {job.startDate} -{' '}
                                        {job.endDate}
                                    </p>
                                    <p className='text-sm'>{job.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Render Education Details */}
                    {educationDetail.length > 0 && (
                        <div className='mt-4'>
                            <h3 className='text-lg font-semibold mb-2'>
                                Education
                            </h3>
                            {educationDetail.map((edu, index) => (
                                <div key={index} className='mt-4'>
                                    <h4 className='text-md font-semibold'>
                                        {edu.institution}
                                    </h4>
                                    <p className='text-sm text-gray-600'>
                                        {edu.course} | {edu.startDate} -{' '}
                                        {edu.endDate}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Render Skills */}
                    {skills && (
                        <div className='mt-4'>
                            <h3 className='text-lg font-semibold mb-2'>
                                Skills
                            </h3>
                            {typeof skills === 'string' ? (
                                <ul className='list-disc list-inside text-sm'>
                                    {skills
                                        .split(/[\n,]+/)
                                        .map((skill, idx) => (
                                            <li key={idx}>{skill.trim()}</li>
                                        ))}
                                </ul>
                            ) : (
                                <p className='text-sm'>No skills provided.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InpTemp;
