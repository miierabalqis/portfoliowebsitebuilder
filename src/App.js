import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import {useAuthContext} from './hooks/useAuthContext';

// pages & components
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Navbar from './components/Navbar';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/profile/Profile';
import EditResume from './pages/resume/edit/ResumeForm';
// import Template from './pages/resume/templates/template';
import Form from './pages/form/Form';
import TempAmit from './pages/resume/templates/TempAmit';

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
                        {/* Protect Profile route */}
                        <Route
                            path='/profile'
                            element={
                                user ? <Profile /> : <Navigate to='/login' />
                            }
                        />
                        {/* <Route
                            path='/template'
                            element={
                                user ? <Template /> : <Navigate to='/login' />
                            }
                        /> */}
                        <Route
                            path='/form'
                            element={user ? <Form /> : <Navigate to='/login' />}
                        />
                        <Route
                            path='/templates/tempamit'
                            element={<TempAmit />}
                        />
                    </Routes>
                </BrowserRouter>
            )}
        </div>
    );
}

export default App;
