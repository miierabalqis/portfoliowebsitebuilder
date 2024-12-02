import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useSignup} from '../../hooks/useSignup';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const {signup, isPending, error} = useSignup();

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(email, password, displayName);
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-amber-50 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg'>
                {/* Header */}
                <div className='text-center'>
                    <h2 className='text-3xl font-extrabold text-gray-900'>
                        Create an account
                    </h2>
                    <p className='mt-2 text-sm text-gray-600'>
                        Join us to create your professional resume
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
                    {/* Display Name Field */}
                    <div>
                        <label
                            htmlFor='displayName'
                            className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Full Name
                        </label>
                        <div className='relative'>
                            <input
                                id='displayName'
                                type='text'
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required
                                className='appearance-none block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out'
                                placeholder='Enter your full name'
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor='email'
                            className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Email address
                        </label>
                        <div className='relative'>
                            <input
                                id='email'
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className='appearance-none block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out'
                                placeholder='Enter your email'
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label
                            htmlFor='password'
                            className='block text-sm font-medium text-gray-700 mb-1'
                        >
                            Password
                        </label>
                        <div className='relative'>
                            <input
                                id='password'
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className='appearance-none block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out'
                                placeholder='Create a strong password'
                            />
                        </div>
                        {/* <p className='mt-1 text-sm text-gray-500'>
                            Must be at least 8 characters
                        </p> */}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm'>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div>
                        <button
                            type='submit'
                            disabled={isPending}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white ${
                                isPending
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            } transition duration-150 ease-in-out`}
                        >
                            {isPending ? (
                                <span className='flex items-center'>
                                    <svg
                                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                    >
                                        <circle
                                            className='opacity-25'
                                            cx='12'
                                            cy='12'
                                            r='10'
                                            stroke='currentColor'
                                            strokeWidth='4'
                                        ></circle>
                                        <path
                                            className='opacity-75'
                                            fill='currentColor'
                                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                        ></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </div>

                    {/* Terms and Privacy */}
                    {/* <div className='text-center text-sm text-gray-600'>
                        By creating an account, you agree to our{' '}
                        <Link
                            to='/terms'
                            className='text-indigo-600 hover:text-indigo-500'
                        >
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                            to='/privacy'
                            className='text-indigo-600 hover:text-indigo-500'
                        >
                            Privacy Policy
                        </Link>
                    </div> */}

                    {/* Sign In Link */}
                    <div className='text-center'>
                        <p className='text-sm text-gray-600'>
                            Already have an account?{' '}
                            <Link
                                to='/login'
                                className='font-medium text-indigo-600 hover:text-indigo-500'
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
