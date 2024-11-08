import styles from './Home.module.css';

export default function Home() {
    return (
        <div className='h-screen bg-gray-100'>
            <section className='flex items-center justify-center min-h-screen text-gray-600'>
                <div className='text-center mb-12 sm:mx-auto sm:w-full sm:max-w-lg'>
                    <h2 className='mt-10 text-center text-2xl font-bold tracking-tight text-gray-900'>
                        Your Dream Resume, Created in an Instant!
                    </h2>
                    <div>
                        <h1 className='block text-sm text-center font-medium text-gray-900'>
                            Select a resume template below to start building
                            your resume
                        </h1>
                    </div>

                    {/* Card Container */}
                    <div className='flex flex-wrap justify-center gap-4'>
                        <div className='p-4 sm:w-full lg:w-full'>
                            <div className='h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden'>
                                <img
                                    src='https://picsum.photos/id/188/720/400'
                                    alt='image'
                                    className='lg:h-72 md:h-48 w-full object-cover object-center'
                                />
                                <div className='p-6 hover:bg-indigo-700 hover:text-white transition duration-300 ease-in'>
                                    <h2 className='text-ase font-medium text-indigo-300 mb-1'>
                                        October 29, 2021
                                    </h2>
                                    <h1 className='text-2xl font-semibold mb-3'>
                                        Cities are crowded
                                    </h1>
                                    <p className='leading-relaxed mb-3'>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit, sed do eiusmod tempor
                                        incididunt ut labore et dolore magna
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
                                            >
                                                <path d='M5 12H14'></path>
                                                <path d='M12 517 7-7 7'></path>
                                            </svg>
                                            Read More
                                        </a>
                                        <span className='text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200'>
                                            <svg
                                                className='w-4 h-4 ml-2'
                                                viewBox='0 0 24 24'
                                                stroke='currentColor'
                                                strokeWidth='2'
                                                fill='none'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            >
                                                <path d='M1 12s4-8 11-8 11 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
                                                <circle
                                                    cx='12'
                                                    cy='12'
                                                    r='3'
                                                ></circle>
                                            </svg>
                                            1.2k
                                        </span>
                                        <span className='text-gray-400 inline-flex items-center leading-none text-sm'>
                                            <svg
                                                className='w-4 h-4 ml-2'
                                                viewBox='0 0 24 24'
                                                stroke='currentColor'
                                                strokeWidth='2'
                                                fill='none'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            >
                                                <path
                                                    d='M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0
                                                01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 8.5 0 014.7-7.6 8.38
                                                8.38 0 013.8-9h.5a8.48 8.48 0 018 8v.5z'
                                                ></path>
                                                <circle
                                                    cx='12'
                                                    cy='12'
                                                    r='3'
                                                ></circle>
                                            </svg>
                                            6
                                        </span>
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
