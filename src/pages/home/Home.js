import resume from '../../assets/images/resume2.jpg'; // Relative path from Home.js
import {useNavigate} from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate('/edit'); // Navigate to the EditForm page
    };

    return (
        <div className='min-h-screen bg-gray-100'>
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

                    {/* Card */}
                    <div
                        className='flex flex-wrap justify-center cursor-pointer'
                        onClick={handleEditClick} // Add the onClick event for the whole card
                    >
                        <div className='p-2 sm:w-full max-w-xs'>
                            <div className='flex flex-col h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden group relative'>
                                {/* Image */}
                                <img
                                    src={resume}
                                    alt='Resume'
                                    className='h-74 w-full object-cover object-center transition-all duration-300 ease-in-out'
                                />

                                {/* Dark overlay only for the bottom part of the image */}
                                <div className='group-hover:block hidden absolute bottom-0 left-0 w-full h-1/4 bg-black bg-opacity-75'></div>

                                {/* Left-side text on hover */}
                                <div className='group-hover:block hidden absolute bottom-0 left-0 text-white text-base font-semibold py-4 px-4 mb-4'>
                                    Yellow Template
                                </div>

                                {/* Edit button at the bottom right */}
                                <div className='group-hover:block hidden absolute bottom-0 right-0 bg-purple-600 text-white text-sm py-4 px-4 rounded cursor-pointer mb-5 mr-5'>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent the card click from firing
                                            handleEditClick();
                                        }}
                                        className='w-full text-center font-semibold'
                                    >
                                        Select
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
