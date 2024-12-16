import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useLogin} from '../../hooks/useLogin';
import {useAuthContext} from '../../hooks/useAuthContext';
import {FcGoogle} from 'react-icons/fc';

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
            <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-[#CDC1FF]/10 via-[#BFECFF]/10 to-[#FFCCEA]/10'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#CDC1FF]'></div>
            </div>
        );
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-[#CDC1FF]/10 via-[#BFECFF]/10 to-[#FFCCEA]/10 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-[#CDC1FF]/20'>
                {/* Header */}
                <div className='text-center'>
                    <h2 className='text-3xl font-extrabold text-black'>
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
                                className='appearance-none block w-full px-4 py-3 rounded-lg border border-[#CDC1FF]/30 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CDC1FF] focus:border-transparent transition duration-150 ease-in-out'
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
                                className='appearance-none block w-full px-4 py-3 rounded-lg border border-[#CDC1FF]/30 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CDC1FF] focus:border-transparent transition duration-150 ease-in-out'
                                placeholder='Enter your password'
                            />
                        </div>
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
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-black
                                ${
                                    isPending
                                        ? 'bg-[#CDC1FF]/50 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#CDC1FF] to-[#BFECFF] hover:from-[#BFECFF] hover:to-[#FFCCEA] hover:scale-105 transform transition-all duration-300 hover:shadow-lg'
                                }`}
                        >
                            {isPending ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-[#CDC1FF]/30'></div>
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
                            className='w-full flex items-center justify-center px-4 py-3 border border-[#CDC1FF]/30 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#CDC1FF] transition duration-150 ease-in-out'
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
                                className='font-medium text-[#CDC1FF] hover:text-[#BFECFF]'
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
