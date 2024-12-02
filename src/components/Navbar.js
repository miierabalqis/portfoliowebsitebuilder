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
import logo from '../assets/images/logo.png';

const navigation = [{name: 'Templates', href: '/home', current: true}];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
    const {logout} = useLogout();
    const {user} = useAuthContext();
    const navigate = useNavigate();
    const handleFormClick = () => {
        navigate('/form');
    };

    return (
        <Disclosure
            as='nav'
            className='bg-gray-900 fixed top-0 left-0 w-full z-50 border-b border-purple-800'
        >
            <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
                <div className='relative flex h-16 items-center justify-between'>
                    <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                        <DisclosureButton className='group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-purple-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500'>
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
                            <Link
                                to='/'
                                className='hover:opacity-80 transition-opacity duration-300'
                            >
                                <img
                                    alt='logo'
                                    src={logo}
                                    className='ml-1 mr-5 h-32 w-32'
                                />
                            </Link>
                        </div>
                        <div className='hidden sm:ml-12 mt-11 sm:block'>
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
                                                ? 'bg-purple-800 text-white'
                                                : 'text-gray-300 hover:bg-purple-700 hover:text-white',
                                            'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300',
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
                        {user ? (
                            <>
                                <Link
                                    to='/dashboard'
                                    className='block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-purple-800 rounded-md transition-colors duration-300'
                                >
                                    My Dashboard
                                </Link>
                                <span className='block px-4 py-2 text-sm text-gray-300'>
                                    Hello, {user.displayName || 'User'}
                                </span>

                                <Menu as='div' className='relative ml-3'>
                                    <div>
                                        <MenuButton className='relative flex items-center rounded-full bg-purple-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800'>
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
                                        className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                                    >
                                        <MenuItem>
                                            <Link
                                                to='/profile'
                                                className='block px-4 py-2 text-sm text-gray-300 hover:bg-purple-800 hover:text-white transition-colors duration-300'
                                            >
                                                Your Profile
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href='#'
                                                className='block px-4 py-2 text-sm text-gray-300 hover:bg-purple-800 hover:text-white transition-colors duration-300'
                                            >
                                                Settings
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <button
                                                className='block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-purple-800 hover:text-white transition-colors duration-300'
                                                onClick={logout}
                                            >
                                                Logout
                                            </button>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </>
                        ) : (
                            <div className='flex space-x-4'>
                                <Link
                                    to='/login'
                                    className='px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-purple-800 rounded-md transition-colors duration-300'
                                >
                                    Login
                                </Link>
                                <Link
                                    to='/signup'
                                    className='px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors duration-300'
                                >
                                    Signup
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
                                    ? 'bg-purple-800 text-white'
                                    : 'text-gray-300 hover:bg-purple-700 hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium transition-colors duration-300',
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
