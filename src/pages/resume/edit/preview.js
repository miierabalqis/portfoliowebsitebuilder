//Preview

import React, {useState, useEffect, useRef} from 'react';

const A4_WIDTH = 595; // A4 width in pixels
const A4_HEIGHT = 842; // A4 height in pixels

function Preview({resumeData, renderFormattedText}) {
    const contentRef = useRef(null);
    const [pages, setPages] = useState([[]]);

    // This function will handle breaking the content into pages based on height
    const createPages = () => {
        const pageContent = [];
        let currentPage = [];
        let currentHeight = 0;

        // Helper function to estimate the height of a section (in pixels)
        const estimateSectionHeight = (section) => {
            if (section === 'personal') return 120; // Estimated height for personal section
            if (section === 'summary') return 150; // Estimated height for summary section
            if (section === 'experience') return 200; // Estimated height for experience section
            if (section === 'education') return 150; // Estimated height for education section
            if (section === 'skills') return 100; // Estimated height for skills section
            return 50; // Default height estimate for other sections
        };

        // Profile Photo Section
        const profilePhotoSection = (
            <div className='my-4 text-center'>
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
            </div>
        );
        currentHeight += estimateSectionHeight('personal');
        currentPage.push(profilePhotoSection);

        // Personal Details Section
        const personalSection = (
            <div className='my-4'>
                <h3 className='text-xl font-bold'>
                    {resumeData.personalDetail.name}
                </h3>
                <p className='text-sm'>{resumeData.personalDetail.email}</p>
                <p className='text-sm'>{resumeData.personalDetail.phone}</p>
                <p className='text-sm'>{resumeData.personalDetail.address}</p>
            </div>
        );
        currentHeight += estimateSectionHeight('personal');
        currentPage.push(personalSection);

        // Line to separate the summary section
        currentPage.push(<hr className='my-4 border-t-2 border-gray-300' />);

        // Summary Section
        const summarySection = (
            <div className='my-4'>
                <h4 className='text-lg font-bold'>Summary</h4>
                <div>{renderFormattedText(resumeData.summary)}</div>
            </div>
        );
        currentHeight += estimateSectionHeight('summary');
        currentPage.push(summarySection);

        // Line to separate the summary section
        currentPage.push(<hr className='my-4 border-t-2 border-gray-300' />);

        // Experience Section
        const experienceSection = (
            <div className='my-4'>
                <h4 className='text-lg font-bold'>Experience</h4>
                {resumeData.experience.map((exp, index) => (
                    <div key={index} className='my-4'>
                        <h5 className='text-base font-semibold mt-4'>
                            {exp.company}
                        </h5>
                        <p className='text-sm'>Position: {exp.position}</p>
                        <p className='text-sm'>
                            Period: {exp.startDate} - {exp.endDate || 'Present'}
                        </p>
                        <p className='text-sm'>
                            {renderFormattedText(exp.description)}
                        </p>
                    </div>
                ))}
            </div>
        );
        currentHeight += estimateSectionHeight('experience');
        currentPage.push(experienceSection);

        // Line to separate the summary section
        currentPage.push(<hr className='my-4 border-t-2 border-gray-300' />);

        // Education Section
        const educationSection = (
            <div className='my-4'>
                <h4 className='text-lg font-bold'>Education</h4>
                {resumeData.educationDetail.map((edu, index) => (
                    <div key={index} className='my-4'>
                        <h5 className='text-base font-semibold'>
                            {edu.institution}
                        </h5>
                        <p className='text-sm'>Course: {edu.course}</p>
                        <p className='text-sm'>
                            {edu.startDate} - {edu.endDate || 'Present'}
                        </p>
                    </div>
                ))}
            </div>
        );
        currentHeight += estimateSectionHeight('education');
        currentPage.push(educationSection);

        // Line to separate the summary section
        currentPage.push(<hr className='my-4 border-t-2 border-gray-300' />);

        // Skills Section
        const skillsSection = (
            <div className='my-4'>
                <h4 className='text-lg font-bold'>Skills</h4>
                <p className='text-sm'>
                    {renderFormattedText(resumeData.skills)}
                </p>
            </div>
        );
        currentHeight += estimateSectionHeight('skills');
        currentPage.push(skillsSection);

        // Check if the current content exceeds the A4 height
        if (currentHeight > A4_HEIGHT) {
            const numberOfPages = Math.ceil(currentHeight / A4_HEIGHT);
            const pagesArr = [];

            // Split content into multiple pages
            let contentIndex = 0;
            for (let i = 0; i < numberOfPages; i++) {
                const page = [];
                let currentPageHeight = 0;

                // Add sections to the current page while there is space left
                while (
                    currentPageHeight < A4_HEIGHT &&
                    contentIndex < currentPage.length
                ) {
                    const section = currentPage[contentIndex];
                    page.push(section);
                    currentPageHeight += estimateSectionHeight('personal'); // Adjust for accurate height
                    contentIndex++;
                }

                pagesArr.push(page);
            }
            setPages(pagesArr);
        } else {
            setPages([currentPage]); // If content fits within one page
        }
    };

    useEffect(() => {
        createPages(); // Call the function to split content into pages
    }, [resumeData, renderFormattedText]);

    return (
        <div className='text-sm text-gray-900 px-10 py-6'>
            <div className='flex flex-col items-center'>
                {/* Render all pages */}
                {pages.map((page, index) => (
                    <div
                        key={index}
                        className='border border-gray-300 p-5 rounded-lg my-4 overflow-hidden'
                        style={{
                            height: A4_HEIGHT,
                            width: A4_WIDTH, // Fix the width to A4 size
                            pageBreakAfter: 'always', // Ensure each page starts on a new page when printing
                        }}
                    >
                        {page.map((section, idx) => (
                            <div key={idx}>{section}</div>
                        ))}
                    </div>
                ))}

                {/* Download Button */}
                {/* <div className="mt-4">
                    <ReactToPdf targetRef={contentRef} filename="resume.pdf">
                        {({ toPdf }) => (
                            <button
                                onClick={toPdf}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
                            >
                                Download Resume as PDF
                            </button>
                        )}
                    </ReactToPdf>
                </div> */}
            </div>
        </div>
    );
}

export default Preview;
