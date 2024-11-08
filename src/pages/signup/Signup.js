import {useState} from 'react';
import {useSignup} from '../../hooks/useSignup';

// styles
import styles from './Signup.module.css';

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
        <div className='flex min-h-full flex-col justify-center px-12 py-24 lg:px-24 bg-gray-100'>
            <form onSubmit={handleSubmit} className={styles['signup-form']}>
                <div className='sm:mx-auto sm:w-full sm:max-w-lg'>
                    <h2 className='mt-10 text-center text-2xl font-bold tracking-tight text-gray-900'>
                        Sign up
                    </h2>
                </div>

                <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-lg'>
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

                <label className='block text-sm font-medium text-gray-900'>
                    <span>Display name:</span>

                    <div className='mt-2'>
                        <input
                            type='text'
                            onChange={(e) => setDisplayName(e.target.value)}
                            value={displayName}
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm'
                        />
                    </div>
                </label>

                <div className='mt-6'>
                    {!isPending && (
                        <button className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                            Sign up
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
                </div>
            </form>
        </div>
    );
}
