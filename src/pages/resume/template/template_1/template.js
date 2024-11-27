import React from 'react';

const template = () => {
    return (
        <div className='bg-gray-100 text-gray-800 min-h-screen py-10 px-5 p-10'>
            <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden p-5'>
                <div className='p-5 sm:p-6'>
                    {/* Header */}
                    <div className='flex items-center justify-between p-5'>
                        <div>
                            <h2 className='text-2xl font-semibold'>John Doe</h2>
                            <p className='text-sm text-gray-600'>
                                Senior Software Engineer
                            </p>
                        </div>
                        <div>
                            <p className='text-sm text-gray-600'>
                                Phone: (123) 456-7890
                            </p>
                            <p className='text-sm text-gray-600'>
                                Email: john.doe@example.com
                            </p>
                            <p className='text-sm text-gray-600'>
                                Location: San Francisco, CA
                            </p>
                        </div>
                    </div>

                    <hr className='my-4' />

                    {/* Summary */}
                    <div>
                        <h3 className='text-lg font-semibold mb-2'>Summary</h3>
                        <p className='text-sm leading-relaxed'>
                            Results-oriented Senior Software Engineer with 20
                            years of experience designing, developing, and
                            deploying complex software solutions. Proficient in
                            a variety of programming languages and technologies.
                            Proven track record of leading teams and delivering
                            high-quality products.
                        </p>
                    </div>

                    {/* Experience */}
                    <div className='mt-4'>
                        <h3 className='text-lg font-semibold mb-2'>
                            Experience
                        </h3>
                        <div>
                            <h4 className='text-md font-semibold'>
                                ABC Corporation
                            </h4>
                            <p className='text-sm text-gray-600'>
                                Senior Software Engineer | 2015 - Present
                            </p>
                            <ul className='list-disc list-inside text-sm'>
                                <li>
                                    Lead a team of developers in designing and
                                    implementing a scalable microservices
                                    architecture.
                                </li>
                                <li>
                                    Developed and maintained critical components
                                    of the company's flagship product, resulting
                                    in increased reliability and performance.
                                </li>
                                <li>
                                    Collaborated with product managers to define
                                    project requirements and timelines.
                                </li>
                            </ul>
                        </div>
                        <div className='mt-4'>
                            <h4 className='text-md font-semibold'>XYZ Tech</h4>
                            <p className='text-sm text-gray-600'>
                                Software Engineer | 2008 - 2015
                            </p>
                            <ul className='list-disc list-inside text-sm'>
                                <li>
                                    Contributed to the development of a
                                    cutting-edge mobile application, used by
                                    millions of users worldwide.
                                </li>
                                <li>
                                    Implemented continuous integration and
                                    deployment pipelines, improving team
                                    efficiency and product quality.
                                </li>
                                <li>
                                    Mentored junior engineers and conducted code
                                    reviews to ensure adherence to best
                                    practices.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className='mt-4'>
                        <h3 className='text-lg font-semibold mb-2'>Skills</h3>
                        <ul className='list-disc list-inside text-sm'>
                            <li>
                                Programming Languages: Java, Python, JavaScript
                            </li>
                            <li>
                                Frameworks & Libraries: Spring Boot, React,
                                Angular
                            </li>
                            <li>
                                Database Systems: MySQL, PostgreSQL, MongoDB
                            </li>
                            <li>
                                Cloud Technologies: AWS, Azure, Google Cloud
                                Platform
                            </li>
                            <li>Agile Methodologies: Scrum, Kanban</li>
                            <li>DevOps Tools: Docker, Kubernetes, Jenkins</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default template;

/////
// import React from 'react';

// const template = ({ resumeData }) => {
//     return (
//         <div className="bg-gray-100 text-gray-800 min-h-screen py-10 px-5">
//             <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
//                 <div className="p-4 sm:p-6">
//                     {/* Header */}
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <h2 className="text-2xl font-semibold">{resumeData.name}</h2>
//                             <p className="text-sm text-gray-600">{resumeData.title}</p>
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-600">Phone: {resumeData.phone}</p>
//                             <p className="text-sm text-gray-600">Email: {resumeData.email}</p>
//                             <p className="text-sm text-gray-600">Location: {resumeData.location}</p>
//                         </div>
//                     </div>

//                     <hr className="my-4" />

//                     {/* Summary */}
//                     <div>
//                         <h3 className="text-lg font-semibold mb-2">Summary</h3>
//                         <p className="text-sm leading-relaxed">{resumeData.summary}</p>
//                     </div>

//                     {/* Experience */}
//                     <div className="mt-4">
//                         <h3 className="text-lg font-semibold mb-2">Experience</h3>
//                         {resumeData.experience.map((job, index) => (
//                             <div key={index} className="mt-4">
//                                 <h4 className="text-md font-semibold">{job.company}</h4>
//                                 <p className="text-sm text-gray-600">{job.title} | {job.years}</p>
//                                 <ul className="list-disc list-inside text-sm">
//                                     {job.responsibilities.map((task, idx) => (
//                                         <li key={idx}>{task}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Skills */}
//                     <div className="mt-4">
//                         <h3 className="text-lg font-semibold mb-2">Skills</h3>
//                         <ul className="list-disc list-inside text-sm">
//                             {resumeData.skills.map((skill, idx) => (
//                                 <li key={idx}>{skill}</li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default template;
