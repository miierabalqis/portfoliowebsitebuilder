// hooks/useResumeData.js
import {useState, useEffect} from 'react';

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

const useResumeData = (incomingData) => {
    const [processedData, setProcessedData] = useState(null);
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Process incoming data
    useEffect(() => {
        const updateResumeData = () => {
            try {
                if (incomingData) {
                    const mergedData = {
                        ...defaultResumeData,
                        ...incomingData,
                        personalDetail: {
                            ...defaultResumeData.personalDetail,
                            ...(incomingData.personalDetail || {}),
                        },
                        experience: Array.isArray(incomingData.experience)
                            ? incomingData.experience
                            : defaultResumeData.experience,
                        educationDetail: Array.isArray(
                            incomingData.educationDetail,
                        )
                            ? incomingData.educationDetail
                            : defaultResumeData.educationDetail,
                        skills: Array.isArray(incomingData.skills)
                            ? incomingData.skills
                            : typeof incomingData.skills === 'string'
                            ? incomingData.skills
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
    }, [incomingData]);

    // Process resume data
    useEffect(() => {
        const processResumeData = () => {
            try {
                if (resumeData) {
                    setProcessedData(resumeData);
                } else {
                    setProcessedData(defaultResumeData);
                }
                setLoading(false);
            } catch (err) {
                setError('Error processing resume data');
                console.error('Error processing resume data:', err);
                setLoading(false);
            }
        };

        processResumeData();
    }, [resumeData]);

    return {processedData, loading, error};
};

export default useResumeData;
