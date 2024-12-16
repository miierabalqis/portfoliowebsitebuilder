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

const InpGeoffrey = ({resumeData: incomingData}) => {
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
        <div className='bg-cyan-50 border-solid border-4 border-sky-900 rounded-2xl text-gray-800'>
            <div className='max-w-4xl mx-auto p-6'>
                {/* Header Section */}
                <div className='flex justify-between items-start gap-4 mb-6 border-b-4 pb-2'>
                    <div>
                        <h1 className='text-5xl font-bold text-gray-900 pt-10 pb-8'>
                            <NameSection
                                personalDetail={processedData.personalDetail}
                            />
                        </h1>
                        <h3 className='text-gray-500 pb-2 text-xl font-semibold'>
                            <AddressSection
                                personalDetail={
                                    processedData.personalDetail ||
                                    'Location Not Specified'
                                }
                            />
                        </h3>
                    </div>
                    <div className='text-4xl font-black text-white bg-gray-700 p-8 w-5'>
                        <span className='mx-1'></span>
                        <span className='mx-1'></span>
                        <span className='mx-1'></span>
                    </div>
                </div>

                {/* Contact Section */}
                <div className='grid grid-cols-2 gap-4 mb-8 border-b-4 pb-2'>
                    <div className='mb-2'>
                        Email :{' '}
                        <EmailSection
                            personalDetail={processedData.personalDetail}
                        />
                    </div>
                    <div className='mb-2'>
                        Phone :
                        <PhoneSection
                            personalDetail={processedData.personalDetail}
                        />
                    </div>
                </div>

                {/* Summary Section */}
                {processedData.summary && (
                    <div className='mb-8 border-b-4 pb-2'>
                        <h2 className='text-xl font-bold text-gray-900 mb-2 tracking-widest'>
                            SUMMARY
                        </h2>
                        <div className='text-gray-700 leading-relaxed mb-3'>
                            <SummarySection summary={processedData.summary} />
                        </div>
                    </div>
                )}

                {/* Skills Section */}
                {processedData.skills?.length > 0 && (
                    <div className='mb-9 mt-0 border-b-4 pb-2'>
                        <h2 className='text-xl font-bold text-gray-900 mb-3 tracking-widest'>
                            SKILLS
                        </h2>
                        <div className='flex flex-wrap gap-2 mb-2'>
                            {processedData.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className='bg-gray-800 text-white px-2 py-1 rounded text-sm mb-2'
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                        {/* <div className='flex flex-wrap gap-2 mb-2'>
                            <SkillsSection skills={processedData.skills} />
                        </div> */}
                    </div>
                )}

                {/* Education Section */}
                {processedData.educationDetail?.length > 0 && (
                    <div className='mb-8 border-b-4 pb-2'>
                        <h2 className='text-xl font-bold text-gray-900 mb-3 tracking-widest'>
                            EDUCATION
                        </h2>
                        {processedData.educationDetail.map((edu, index) => (
                            <div key={index} className='mb-4'>
                                <h3 className='font-semibold text-gray-800'>
                                    <InstitutionSection
                                        institution={edu.institution}
                                    />
                                </h3>
                                <p className='text-gray-600 font-medium'>
                                    <CourseSection course={edu.course} />
                                </p>
                                <p className='text-gray-600 text-md'>
                                    <DurationSection
                                        startDate={edu.startDate}
                                        endDate={edu.endDate}
                                    />
                                </p>
                                {edu.result && (
                                    <p className='text-gray-700 mt-2'>
                                        <ResultSection result={edu.result} />
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Experience Section */}
                {processedData.experience?.length > 0 && (
                    <div className='mb-8'>
                        <h2 className='text-xl font-bold text-gray-900 mb-3 tracking-widest'>
                            EXPERIENCE
                        </h2>
                        {processedData.experience.map((job, index) => (
                            <div key={index} className='mb-4'>
                                <h3 className='font-semibold text-gray-800'>
                                    <CompanySection position={job.position} />
                                </h3>
                                <h3 className='font-semibold text-gray-800'>
                                    <PositionSection position={job.position} />
                                </h3>
                                <p className='text-gray-600 text-md'>
                                    <ExperienceDurationSection
                                        startDate={job.startDate}
                                        endDate={job.endDate}
                                    />
                                </p>
                                <div className='text-gray-700 mt-2'>
                                    <ExperienceDescriptionSection
                                        description={job.description}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InpGeoffrey;
