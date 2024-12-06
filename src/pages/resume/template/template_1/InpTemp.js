import React from 'react';
import useResumeData from '../../template/hooks/useResumeData';

//section import
import SummarySection from '../section/SummarySection';
import SkillsSection from '../section/SkillsSection';

//PersonalDetail import
import PhoneSection from '../section/PersonalDetails/PhoneSection';
import EmailSection from '../section/PersonalDetails/EmailSection';
import AddressSection from '../section/PersonalDetails/AddressSection';
import NameSection from '../section/PersonalDetails/NameSection';

//Education import
import InstitutionSection from '../section/Education/InstitutionSection';
import CourseSection from '../section/Education/CourseSection';
import DurationSection from '../section/Education/DurationSection';
import ResultSection from '../section/Education/ResultSection';

//Experience import
import PositionSection from '../section/Experience/PositionSection';
import CompanySection from '../section/Experience/CompanySection';
import ExperienceDurationSection from '../section/Experience/ExperienceDuration';
import ExperienceDescriptionSection from '../section/Experience/ExperienceDescription';

const InpTemp = ({resumeData: incomingData}) => {
    const {processedData, loading, error} = useResumeData(incomingData);

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-[500px]'>
                <p>Loading resume...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex justify-center items-center min-h-[500px]'>
                <p className='text-red-600'>{error}</p>
            </div>
        );
    }

    if (!processedData) {
        return (
            <div className='flex justify-center items-center min-h-[500px]'>
                <p>No resume data found</p>
            </div>
        );
    }

    return (
        <div className='bg-white text-gray-800'>
            <div className='max-w-4xl mx-auto bg-white'>
                <div className='p-4 sm:p-6'>
                    {/* Personal Details Section */}
                    <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8'>
                        <div>
                            <h1 className='text-3xl font-bold text-gray-900'>
                                <NameSection
                                    personalDetail={
                                        processedData.personalDetail
                                    }
                                />
                            </h1>
                            <h1 className='text-gray-700 leading-relaxed'>
                                <AddressSection
                                    personalDetail={
                                        processedData.personalDetail
                                    }
                                />
                            </h1>
                        </div>
                        <div className='text-right'>
                            <EmailSection
                                personalDetail={processedData.personalDetail}
                            />
                            <PhoneSection
                                personalDetail={processedData.personalDetail}
                            />
                        </div>
                    </div>

                    {/* Summary Section with styling */}
                    {processedData.summary && (
                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold text-gray-900 mb-3'>
                                Professional Summary
                            </h2>
                            <div className='text-gray-700 leading-relaxed'>
                                <SummarySection
                                    summary={processedData.summary}
                                />
                            </div>
                        </div>
                    )}

                    {/* Experience Section with styling */}
                    {processedData.experience?.length > 0 && (
                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold text-gray-900 mb-3'>
                                Work Experience
                            </h2>
                            {processedData.experience.map((exp, index) => (
                                <div key={index} className='mb-4'>
                                    <h3 className='text-lg font-semibold text-gray-800'>
                                        <PositionSection
                                            position={exp.position}
                                        />
                                    </h3>
                                    <p className='text-gray-600 font-medium'>
                                        <CompanySection company={exp.company} />
                                    </p>
                                    <p className='text-gray-600 text-sm'>
                                        {' '}
                                        <ExperienceDurationSection
                                            startDate={exp.startDate}
                                            endDate={exp.endDate}
                                        />
                                    </p>
                                    <p className='text-gray-700 mt-2'>
                                        <ExperienceDescriptionSection
                                            description={exp.description}
                                        />
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Education Section with styling */}
                    {processedData.educationDetail?.length > 0 && (
                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold text-gray-900 mb-3'>
                                Education
                            </h2>
                            {processedData.educationDetail.map((edu, index) => (
                                <div key={index} className='mb-4'>
                                    <h3 className='text-lg font-semibold text-gray-800'>
                                        <InstitutionSection
                                            institution={edu.institution}
                                        />
                                    </h3>
                                    <p className='text-gray-600 font-medium'>
                                        <CourseSection course={edu.course} />
                                    </p>
                                    <p className='text-gray-600 text-sm'>
                                        <DurationSection
                                            startDate={edu.startDate}
                                            endDate={edu.endDate}
                                        />
                                    </p>
                                    {edu.result && (
                                        <ResultSection result={edu.result} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Skills Section with styling */}
                    {processedData.skills?.length > 0 && (
                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold text-gray-900 mb-3'>
                                Skills
                            </h2>
                            <div className='flex flex-wrap gap-2'>
                                <SkillsSection skills={processedData.skills} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InpTemp;
