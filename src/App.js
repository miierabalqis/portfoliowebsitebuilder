import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import {useAuthContext} from './hooks/useAuthContext';

// pages & components
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Navbar from './components/Navbar';
import EditResume from './pages/resume/edit';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
    const {authIsReady, user} = useAuthContext();

    return (
        <div className='App'>
            {authIsReady && (
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route
                            path='/'
                            element={user ? <Home /> : <Navigate to='/login' />}
                        />
                        <Route
                            path='/login'
                            element={user ? <Navigate to='/' /> : <Login />}
                        />
                        <Route
                            path='/signup'
                            element={
                                user && user.displayName ? (
                                    <Navigate to='/' />
                                ) : (
                                    <Signup />
                                )
                            }
                        />
                        <Route
                            path='/edit'
                            element={
                                user ? <EditResume /> : <Navigate to='/login' />
                            }
                        />
                        <Route
                            path='/dashboard'
                            element={
                                user ? <Dashboard /> : <Navigate to='/login' />
                            }
                        />
                    </Routes>
                </BrowserRouter>
            )}
        </div>
    );
}

export default App;
