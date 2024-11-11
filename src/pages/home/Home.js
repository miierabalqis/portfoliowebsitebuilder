import resume from '../../images/resume2.jpg'; // Relative path from Home.js

export default function Home() {
    return (
        <div className='h-screen bg-gray-100'>
            <section className='flex items-center justify-center min-h-screen text-gray-600'>
                <div className='text-center mb-12 sm:mx-auto sm:w-full sm:max-w-lg'>
                    <h2 className='mt-10 text-center text-2xl font-bold tracking-tight text-gray-900'>
                        Your Dream Resume, Created in an Instant!
                    </h2>
                    <div className='mb-20'>
                        <div>
                            <h1 className='block text-sm text-center font-medium text-gray-900'>
                                Select a resume template below to start building
                                your resume
                            </h1>
                        </div>
                    </div>

                    <div className='flex flex-wrap justify-center'>
                        {/* Reduce outer width to make the card smaller */}
                        <div className='p-2 sm:w-full lg:w-64'>
                            {' '}
                            <div className='flex flex-col h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden'>
                                {/* Image size remains unchanged */}
                                <img
                                    src={resume}
                                    alt='Resume'
                                    className='lg:h-100 md:h-90 w-full object-cover object-center mb-6'
                                />

                                {/* Content remains unchanged */}
                                <div className='p-2 hover:bg-indigo-700 hover:text-white transition duration-300 ease-in'>
                                    {/* <h2 className='text-ase font-small text-indigo-300 mb-1'>
                                        October 29, 2021
                                    </h2> */}
                                    <h1 className='text-lg font-semibold mb-3'>
                                        Yellow Template
                                    </h1>
                                    <p className=' text-base leading-relaxed mb-1'>
                                        Lorem ipsum dolor sit amet.
                                    </p>
                                    <div className='flex items-center flex-wrap'>
                                        <a
                                            href='#'
                                            className='text-indigo-300 inline-flex items-center md:mb-2 lg:mb-0'
                                        >
                                            <svg
                                                className='w-4 h-4 ml-2'
                                                viewBox='0 0 24 24'
                                                stroke='currentColor'
                                                strokeWidth='2'
                                                fill='none'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            ></svg>
                                            Edit
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
