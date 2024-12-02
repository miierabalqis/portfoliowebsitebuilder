import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import {useAuthContext} from './hooks/useAuthContext';
import React, {useEffect} from 'react';

// pages & components
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Navbar from './components/Navbar';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/profile/Profile';
import EditResume from './pages/resume/edit/ResumeForm';
import Form from './pages/form/Form';
import TempAmit from './pages/resume/template/TempAmit';
import Template from './pages/resume/template/template_1/template';
import InpTemp from './pages/resume/template/template_1/InpTemp';
import DashboardForm from './pages/dashboard/DashboardForm';
import DashboardResumeForm from './pages/dashboard/DashboardResumeForm';
import Landing from './pages/landing/Landing';
// import DisplayTemplate from './pages/resume/teplate/displayTemplate';

function App() {
    const {authIsReady, user} = useAuthContext();

    return (
        <div className='App'>
            {authIsReady && (
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path='/' element={<Landing />} />
                        <Route
                            path='/home'
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
                        <Route
                            path='/dashboardform/:templateId/:resumeId'
                            element={
                                user ? (
                                    <DashboardForm />
                                ) : (
                                    <Navigate to='/login' />
                                )
                            }
                        />
                        <Route
                            path='/dashboardresumeform/:templateId/:resumeId'
                            element={
                                user ? (
                                    <DashboardResumeForm />
                                ) : (
                                    <Navigate to='/login' />
                                )
                            }
                        />

                        <Route
                            path='/profile'
                            element={
                                user ? <Profile /> : <Navigate to='/login' />
                            }
                        />
                        <Route
                            path='/template'
                            element={
                                user ? <Template /> : <Navigate to='/login' />
                            }
                        />
                        <Route
                            path='/form/:templateId/:resumeId'
                            element={user ? <Form /> : <Navigate to='/login' />}
                        />
                        {/* Update the DisplayTemplate route to accept a templateId */}
                        {/* <Route
                            path='/displayTemplate/:templateId'
                            element={
                                user ? (
                                    <DisplayTemplate />
                                ) : (
                                    <Navigate to='/login' />
                                )
                            }
                        /> */}
                        <Route
                            path='/InpTemp/:templateId'
                            element={
                                user ? <InpTemp /> : <Navigate to='/login' />
                            }
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
