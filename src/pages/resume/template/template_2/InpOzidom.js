import React, {useEffect} from 'react';
import useResumeData from '../../template/hooks/useResumeData';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faEnvelope, // for email
    faPhone, // for phone
    faHome, // for address/location
} from '@fortawesome/free-solid-svg-icons';

// Section imports
import SummarySection from '../section/SummarySection';
import SkillsSection from '../section/SkillsSection';
import ProfilePhotoSection from '../section/ProfilePhotoSection';

// Personal Detail imports
import PhoneSection from '../section/PersonalDetails/PhoneSection';
import EmailSection from '../section/PersonalDetails/EmailSection';
import AddressSection from '../section/PersonalDetails/AddressSection';
import NameSection from '../section/PersonalDetails/NameSection';

// Education imports
import InstitutionSection from '../section/Education/InstitutionSection';
import CourseSection from '../section/Education/CourseSection';
import DurationSection from '../section/Education/DurationSection';
import ResultSection from '../section/Education/ResultSection';

// Experience imports
import PositionSection from '../section/Experience/PositionSection';
import CompanySection from '../section/Experience/CompanySection';
import ExperienceDurationSection from '../section/Experience/ExperienceDuration';
import ExperienceDescriptionSection from '../section/Experience/ExperienceDescription';

const InpOzidom = ({resumeData: incomingData}) => {
    const {processedData, loading, error} = useResumeData(incomingData);

    useEffect(() => {
        if (processedData) {
            console.log(
                'Profile photo from processed data:',
                processedData.profilePhoto,
            );
        }
    }, [processedData]);

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
        <div
            className='font-sans antialiased'
            style={{
                width: '800px',
                height: '1000px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                margin: '0 auto',
                overflow: 'hidden',
            }}
        >
            <main
                id='wrapper'
                className='flex flex-col sm:flex-row-reverse'
                style={{height: '100%'}}
            >
                {/* Sidebar */}
                <div
                    id='sidebar'
                    className='w-full sm:max-w-[300px] p-8 bg-gradient-to-b from-emerald-400 via-teal-300 to-white'
                >
                    <div className='px-2 mb-12'>
                        <div className='rounded-full w-48 h-50 mx-auto mb-2 overflow-hidden'>
                            <ProfilePhotoSection
                                profilePhoto={processedData.profilePhoto}
                            />
                        </div>

                        {/* <img
                            src={
                                processedData.profilePhoto ||
                                './assets/default-profile.png' // Fallback to default
                            }
                            alt='Profile Picture'
                            className='rounded-full w-48 mx-auto mb-2'
                        /> */}

                        <h1 className='text-center text-3xl font-semibold mb-2 mt-6'>
                            <NameSection
                                personalDetail={processedData.personalDetail}
                            />
                        </h1>
                    </div>

                    <div className='px-2 mb-12 text-center'>
                        <h2 className='text-xl font-light'>
                            <AddressSection
                                icon={
                                    <FontAwesomeIcon
                                        icon={faHome}
                                        className='w-5 h-5 text-black'
                                    />
                                }
                                personalDetail={processedData.personalDetail}
                            />
                        </h2>
                    </div>

                    <ContactSection
                        personalDetail={processedData.personalDetail}
                    />

                    <div className='font-light text-lg px-2 mb-12'>
                        <h2 className='text-xl font-semibold mb-6'>Skills</h2>
                        <div className='flex flex-wrap gap-2 mr-5'>
                            <SkillsSection skills={processedData.skills} />
                        </div>
                    </div>

                    <EducationSidebarSection
                        educationDetail={processedData.educationDetail}
                    />
                </div>

                {/* Main Content */}
                <div
                    className='content w-full p-8 overflow-y-auto'
                    style={{height: '100%'}}
                >
                    <ProfileSection summary={processedData.summary} />
                    <ExperienceSection experience={processedData.experience} />
                    <EducationSection
                        educationDetail={processedData.educationDetail}
                    />
                </div>
            </main>
        </div>
    );
};

// Contact Section
const ContactSection = ({personalDetail}) => (
    <div className='font-light text-lg px-2 mb-12'>
        <h2 className='text-xl font-semibold mb-4'>Contact</h2>
        <div className='flex flex-col gap-3'>
            <EmailSection
                icon={<FontAwesomeIcon icon={faEnvelope} className='w-5 h-5' />}
                personalDetail={personalDetail}
            />
            <PhoneSection
                icon={<FontAwesomeIcon icon={faPhone} className='w-5 h-5' />}
                personalDetail={personalDetail}
            />
        </div>
    </div>
);

// Sidebar Education Section
const EducationSidebarSection = ({educationDetail}) => (
    <div className='font-light text-lg px-2 mb-12'>
        <h2 className='text-xl font-semibold mb-4'>Education</h2>
        {educationDetail?.length > 0 ? (
            educationDetail.map((edu, index) => (
                <div key={index} className='mb-4'>
                    <h3 className='font-medium'>
                        <InstitutionSection institution={edu.institution} />
                    </h3>
                    <p>
                        <CourseSection course={edu.course} />
                    </p>
                    <p className='text-gray-600 text-sm'>
                        <DurationSection
                            startDate={edu.startDate}
                            endDate={edu.endDate}
                        />
                    </p>
                </div>
            ))
        ) : (
            <p>No education details provided.</p>
        )}
    </div>
);

// Profile Section
const ProfileSection = ({summary}) => (
    <section className='mb-12'>
        <h2 className='text-2xl font-semibold mb-4 uppercase tracking-widest border-emerald-500 border-l-8 pl-2 text-emerald-500'>
            Profile
        </h2>
        <div className='text-gray-700 leading-relaxed'>
            <SummarySection summary={summary} />
        </div>
    </section>
);

// Experience Section
const ExperienceSection = ({experience}) => (
    <section className='mb-12'>
        <h2 className='text-2xl font-semibold mb-4 uppercase tracking-widest border-emerald-500 border-l-8 pl-2 text-emerald-500'>
            Experience
        </h2>
        {experience && experience.length > 0 ? (
            experience.map((exp, index) => (
                <div key={index} className='mb-4'>
                    <h3 className='font-medium'>
                        <PositionSection position={exp.position} />
                        <CompanySection company={exp.company} />
                    </h3>
                    <p className='text-gray-600 text-sm'>
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
            ))
        ) : (
            <p>No work experience provided.</p>
        )}
    </section>
);

// Main Content Education Section
const EducationSection = ({educationDetail}) => (
    <section className='mb-12'>
        <h2 className='text-2xl font-semibold mb-4 uppercase tracking-widest border-emerald-500 border-l-8 pl-2 text-emerald-500'>
            Education
        </h2>
        {educationDetail?.length > 0 ? (
            educationDetail.map((edu, index) => (
                <div key={index} className='mb-4'>
                    <h3 className='font-medium'>
                        <InstitutionSection institution={edu.institution} />
                    </h3>
                    <p className='text-gray-600'>
                        <CourseSection course={edu.course} />
                    </p>
                    <p className='text-gray-600 text-sm'>
                        <DurationSection
                            startDate={edu.startDate}
                            endDate={edu.endDate}
                        />
                    </p>
                    {edu.result && (
                        <p className='text-gray-600'>
                            <ResultSection result={edu.result} />
                        </p>
                    )}
                </div>
            ))
        ) : (
            <p>No education details provided.</p>
        )}
    </section>
);

export default InpOzidom;
