//Login.js

import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom'; // Use useNavigate instead of useHistory in React Router v6
import {useLogin} from '../../hooks/useLogin';
import {useAuthContext} from '../../hooks/useAuthContext'; // Import the AuthContext
import styles from './Login.module.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, loginWithGoogle, error, isPending} = useLogin();
    const {user, authIsReady} = useAuthContext(); // Use the user state from the context
    const navigate = useNavigate(); // React Router v6 hook for navigation

    // Redirect to dashboard once user is logged in
    useEffect(() => {
        if (authIsReady && user) {
            navigate('/dashboard'); // Redirect to dashboard or home page after successful login
        }
    }, [authIsReady, user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    // Display loading state while the auth state is not ready
    if (!authIsReady) {
        return <div>Loading...</div>; // Or you can display a loader here
    }

    return (
        <div className='flex min-h-full flex-col justify-center px-8 py-16 lg:px-12 bg-gray-100'>
            <form onSubmit={handleSubmit} className={styles['login-form']}>
                <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                    <h2 className='mt-10 text-center text-2xl font-bold tracking-tight text-gray-900'>
                        Sign in to your account
                    </h2>
                </div>

                {/* Email input */}
                <div className='mt-1 sm:mx-auto sm:w-full sm:max-w-sm'>
                    <label
                        htmlFor='email'
                        className='block text-sm font-medium text-gray-900'
                    >
                        <span>Email address</span>
                        <div className='mt-2'>
                            <input
                                type='email'
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm'
                            />
                        </div>
                    </label>
                </div>

                {/* Password input */}
                <div>
                    <label
                        htmlFor='password'
                        className='block text-sm font-medium text-gray-900'
                    >
                        Password
                    </label>
                    <div className='mt-2'>
                        <input
                            type='password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            autoComplete='current-password'
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm'
                        />
                    </div>
                </div>

                {/* Submit button */}
                <div className='mt-6'>
                    {!isPending && (
                        <button className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                            Login
                        </button>
                    )}
                    {isPending && (
                        <button
                            className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            disabled
                        >
                            Loading
                        </button>
                    )}
                    {error && <p>{error}</p>}

                    {/* Google Sign-In Button */}
                    <p className='mt-10 text-center text-sm text-gray-500'>
                        or continue with
                    </p>
                    <div className='mt-6'>
                        <button
                            onClick={loginWithGoogle}
                            className='flex w-full justify-center rounded-md bg-white-600 px-0.5 py-2 text-xs font-semibold text-black shadow-sm hover:bg-indigo-500 focus-visible:outline-4 focus-visible:outline-solid focus-visible:outline-indigo-500'
                        >
                            Google
                        </button>
                    </div>

                    {/* Link to sign up page */}
                    <p className='mt-10 text-center text-sm text-gray-500'>
                        Not a member?{' '}
                        <Link
                            to='/signup'
                            className='font-semibold text-indigo-600 hover:text-indigo-500'
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
