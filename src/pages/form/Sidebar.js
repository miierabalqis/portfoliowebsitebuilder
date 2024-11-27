import React, {useState} from 'react';
import {Link} from 'react-scroll'; // Import Link from react-scroll
import {useNavigate, Link as RouterLink} from 'react-router-dom';

const Sidebar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const handleTemplateClick = () => {
        navigate('/template'); // Navigate to the EditForm page
    };

    return (
        <div className='relative'>
            {/* Fixed Sidebar */}
            <div className='fixed top-16 left-0 w-25 h-full bg-blue-400 px-4 py-8 z-50 overflow-y-auto'>
                <nav className='flex flex-col'>
                    <Link
                        to='personal'
                        smooth={true}
                        duration={500}
                        offset={-100}
                        className='block px-2 py-2 mt-2 text-xs text-gray-900 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none font-sans'
                        aria-label='Scroll to Personal Section'
                    >
                        Personal
                    </Link>
                    <Link
                        to='summary'
                        smooth={true}
                        duration={500}
                        offset={-100}
                        className='block px-2 py-2 mt-2 text-xs text-gray-900 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none font-sans'
                        aria-label='Scroll to Summary Section'
                    >
                        Summary
                    </Link>
                    <Link
                        to='experience'
                        smooth={true}
                        duration={500}
                        offset={-100}
                        className='block px-2 py-2 mt-2 text-xs text-gray-900 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none font-sans'
                        aria-label='Scroll to Experience Section'
                    >
                        Experience
                    </Link>
                    <Link
                        to='education'
                        smooth={true}
                        duration={500}
                        offset={-100}
                        className='block px-2 py-2 mt-2 text-xs text-gray-900 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none font-sans'
                        aria-label='Scroll to Education Section'
                    >
                        Education
                    </Link>
                    <Link
                        to='skill'
                        smooth={true}
                        duration={500}
                        offset={-100}
                        className='block px-2 py-2 mt-2 text-xs text-gray-900 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none font-sans'
                        aria-label='Scroll to Skills Section'
                    >
                        Skills
                    </Link>
                    <div className='relative'>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className='flex items-center w-full px-2 py-2 mt-2 text-xs text-left rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none font-sans'
                        >
                            Templates
                            <svg
                                fill='currentColor'
                                viewBox='0 0 20 20'
                                className={`inline w-3 h-3 ml-2 transition-transform duration-200 transform ${
                                    dropdownOpen ? 'rotate-180' : 'rotate-0'
                                }`}
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                                    clipRule='evenodd'
                                ></path>
                            </svg>
                        </button>
                        {dropdownOpen && (
                            <div className='absolute w-full mt-2 rounded shadow-lg bg-white dark:bg-gray-800'>
                                <RouterLink
                                    to='/templates/tempamit' // Use the route path for TempAmit component
                                    className='block px-2 py-2 text-xs text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-600'
                                >
                                    TempAmit
                                </RouterLink>
                                <button
                                    className='block px-2 py-2 text-xs text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    onClick={handleTemplateClick}
                                >
                                    TempJohn
                                </button>
                                <button className='block px-2 py-2 text-xs text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-600'>
                                    Link #3
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
