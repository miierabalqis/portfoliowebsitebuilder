import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useLogin} from '../../hooks/useLogin';
import {useAuthContext} from '../../hooks/useAuthContext';
import {FcGoogle} from 'react-icons/fc'; // Import Google icon

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, loginWithGoogle, error, isPending} = useLogin();
    const {user, authIsReady} = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (authIsReady && user) {
            navigate('/dashboard');
        }
    }, [authIsReady, user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    if (!authIsReady) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-amber-50'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600'></div>
            </div>
        );
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-amber-50 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg'>
                {/* Header */}
                <div className='text-center'>
                    <h2 className='text-3xl font-extrabold text-gray-900'>
                        Welcome
                    </h2>
                    <p className='mt-2 text-sm text-gray-600'>
                        Please sign in to your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
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
                                placeholder='Enter your password'
                            />
                        </div>
                        {/* <div className='text-right mt-1'>
                            <Link
                                to='/forgot-password'
                                className='text-sm text-indigo-600 hover:text-indigo-500 font-medium'
                            >
                                Forgot password?
                            </Link>
                        </div> */}
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
                                    Signing in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-gray-300'></div>
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='px-2 bg-white text-gray-500'>
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Google Sign-In Button */}
                    <div>
                        <button
                            type='button'
                            onClick={loginWithGoogle}
                            className='w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out'
                        >
                            <FcGoogle className='h-5 w-5 mr-2' />
                            Sign in with Google
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className='text-center'>
                        <p className='text-sm text-gray-600'>
                            Don't have an account?{' '}
                            <Link
                                to='/signup'
                                className='font-medium text-indigo-600 hover:text-indigo-500'
                            >
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
