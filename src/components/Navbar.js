import {Link, useNavigate} from 'react-router-dom';
import {useAuthContext} from '../hooks/useAuthContext';
import {useLogout} from '../hooks/useLogout';
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline';
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/react';

//import user image
import profileImage from '../assets/images/profile.png';

const navigation = [
    {name: 'Templates', href: '/', current: true}, // Update this link if needed
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
    const {logout} = useLogout();
    const {user} = useAuthContext(); // Get user from context (auth state)
    const navigate = useNavigate();
    const handleFormClick = () => {
        navigate('/form'); // Navigate to the EditForm page
    };

    return (
        <Disclosure
            as='nav'
            className='bg-gray-800 fixed top-0 left-0 w-full z-50'
        >
            <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
                <div className='relative flex h-16 items-center justify-between'>
                    <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                        {/* Mobile menu button */}
                        <DisclosureButton className='group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                            <span className='absolute -inset-0.5' />
                            <span className='sr-only'>Open main menu</span>
                            <Bars3Icon
                                aria-hidden='true'
                                className='block h-6 w-6 group-data-[open]:hidden'
                            />
                            <XMarkIcon
                                aria-hidden='true'
                                className='hidden h-6 w-6 group-data-[open]:block'
                            />
                        </DisclosureButton>
                    </div>
                    <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
                        <div className='flex shrink-0 items-center'>
                            <img
                                alt='Your Company'
                                src='https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500'
                                className='h-8 w-auto'
                            />
                        </div>
                        <div className='hidden sm:ml-6 sm:block'>
                            <div className='flex space-x-4'>
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        aria-current={
                                            item.current ? 'page' : undefined
                                        }
                                        className={classNames(
                                            item.current
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'rounded-md px-3 py-2 text-sm font-medium',
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className='hidden sm:ml-6 sm:block'>
                            <div className='flex space-x-4 bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium'>
                                <button onClick={handleFormClick}>Form</button>
                            </div>
                        </div>
                    </div>
                    <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
                        {/* Conditional rendering for user's name */}
                        {user ? (
                            <>
                                <Link
                                    to='/dashboard' // Link to dashboard page
                                    className='block px-4 py-2 text-sm text-white data-[focus]:bg-gray-100 data-[focus]:outline-none'
                                >
                                    My Dashboard
                                </Link>
                                <li className='block px-4 py-2 text-sm text-white'>
                                    Hello, {user.displayName || 'User'}{' '}
                                    {/* Safely access displayName */}
                                </li>

                                {/* Dropdown Menu */}
                                <Menu as='div' className='relative ml-3'>
                                    <div>
                                        <MenuButton className='relative flex items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
                                            <span className='absolute -inset-1.5' />
                                            <span className='sr-only'>
                                                Open user menu
                                            </span>
                                            <img
                                                alt='User Profile'
                                                src={
                                                    user.photoURL ||
                                                    profileImage
                                                }
                                                className='h-8 w-8 rounded-full'
                                            />
                                        </MenuButton>
                                    </div>
                                    <MenuItems
                                        transition
                                        className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'
                                    >
                                        {/* Add Profile link */}
                                        <MenuItem>
                                            <Link
                                                to='/profile' // Link to Profile page
                                                className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none'
                                            >
                                                Your Profile
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href='#'
                                                className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none'
                                            >
                                                Settings
                                            </a>
                                        </MenuItem>
                                        <li>
                                            <button
                                                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100'
                                                onClick={logout}
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </MenuItems>
                                </Menu>
                            </>
                        ) : (
                            <div className='flex space-x-4'>
                                {/* Show Login and Signup buttons when not logged in */}
                                <Link
                                    to='/login'
                                    className='block px-4 py-2 text-sm text-white hover:bg-gray-100 focus:outline-none'
                                >
                                    Login
                                </Link>
                                <Link
                                    to='/signup'
                                    className='block px-4 py-2 text-sm text-white hover:bg-gray-100 focus:outline-none'
                                >
                                    Signup
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <DisclosurePanel className='sm:hidden'>
                <div className='space-y-1 px-2 pb-3 pt-2'>
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as='a'
                            href={item.href}
                            aria-current={item.current ? 'page' : undefined}
                            className={classNames(
                                item.current
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium',
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}
