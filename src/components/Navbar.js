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
import logo from '../assets/images/logo image.png';

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
            className='bg-white/80 backdrop-blur-md fixed top-0 left-0 w-full z-50 border-b-4 border-gradient-to-r from-[#CDC1FF] to-[#BFECFF]'
        >
            <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
                <div className='relative flex h-16 items-center justify-between'>
                    <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                        <DisclosureButton className='group relative inline-flex items-center justify-center rounded-full p-2 text-gray-600 hover:bg-gradient-to-r hover:from-[#CDC1FF] hover:to-[#BFECFF] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#CDC1FF]'>
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
                    <div className='flex flex-1 items-center justify-between sm:items-stretch sm:justify-start'>
                        <div className='flex shrink-0 items-center'>
                            <Link
                                to='/'
                                className='hover:opacity-80 transition-opacity duration-300 ml-0 sm:ml-1'
                            >
                                <img
                                    alt='logo'
                                    src={logo}
                                    className='h-64 w-64 mr-11 self-center pt-3'
                                />
                            </Link>
                        </div>
                        <div className='hidden sm:ml-12 sm:flex sm:items-center'>
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
                                                ? 'bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black'
                                                : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#CDC1FF] hover:to-[#BFECFF] hover:text-black',
                                            'rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300',
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-11 sm:pr-0'>
                        {user ? (
                            <>
                                <Link
                                    to='/dashboard'
                                    className='block px-4 py-2 text-sm text-black font-semibold hover:text-black hover:bg-gradient-to-r hover:from-[#CDC1FF] hover:to-[#BFECFF] rounded-full transition-all duration-300'
                                >
                                    My Dashboard
                                </Link>
                                <span className='block px-4 py-2 text-sm text-black font-semibold'>
                                    Hello, {user.displayName || 'User'}
                                </span>

                                <Menu as='div' className='relative ml-3'>
                                    <div>
                                        <MenuButton className='relative flex items-center rounded-full p-0.5 bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] hover:from-[#BFECFF] hover:to-[#FFCCEA] transition-all duration-300'>
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
                                        className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-[#CDC1FF]/20 focus:outline-none'
                                    >
                                        <MenuItem>
                                            <Link
                                                to='/profile'
                                                className='block px-4 py-2 text-sm text-gray-600 hover:bg-gradient-to-r hover:from-[#CDC1FF]/10 hover:to-[#BFECFF]/10 hover:text-black transition-all duration-300'
                                            >
                                                Your Profile
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href='#'
                                                className='block px-4 py-2 text-sm text-gray-600 hover:bg-gradient-to-r hover:from-[#CDC1FF]/10 hover:to-[#BFECFF]/10 hover:text-black transition-all duration-300'
                                            >
                                                Settings
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <button
                                                className='block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gradient-to-r hover:from-[#CDC1FF]/10 hover:to-[#BFECFF]/10 hover:text-black transition-all duration-300'
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
                                    className='px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gradient-to-r hover:from-[#CDC1FF] hover:to-[#BFECFF] rounded-full transition-all duration-300'
                                >
                                    Login
                                </Link>
                                <Link
                                    to='/signup'
                                    className='px-6 py-2 text-sm text-black bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] hover:from-[#BFECFF] hover:to-[#FFCCEA] rounded-full transition-all duration-300 hover:shadow-lg'
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
                                    ? 'bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] text-black'
                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#CDC1FF] hover:to-[#BFECFF] hover:text-black',
                                'block rounded-full px-4 py-2 text-base font-semibold transition-all duration-300',
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
