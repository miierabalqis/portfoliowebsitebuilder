import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import cv from '../../assets/images/add.png';
import resume from '../../assets/images/resume2.jpg';
import edit from '../../assets/images/dashboard/edit2.png';
import resumeic from '../../assets/images/dashboard/resumeic.png';
import editname from '../../assets/images/dashboard/editname.png';
import view from '../../assets/images/dashboard/view.png';
import del from '../../assets/images/dashboard/delete.png';
import {fetchUserResumesWithTemplates} from '../../firebase/helpers';

// Modal Component
const EditModal = ({isOpen, closeModal, submitEdit, currentName}) => {
    const [newName, setNewName] = useState(currentName);

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleSubmit = () => {
        submitEdit(newName);
        closeModal();
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white p-6 rounded-lg w-[90%] sm:w-[400px]'>
                <h2 className='text-base font-semibold text-gray-900 text-center px-4 py-4'>
                    Rename your resume
                </h2>
                <input
                    type='text'
                    value={newName}
                    onChange={handleNameChange}
                    className='border border-gray-300 p-2 w-full mb-4 rounded-md'
                    placeholder='Enter new template name'
                />
                <div className='flex justify-between'>
                    <button
                        onClick={closeModal}
                        className='text-base font-semibold bg-gray-400 text-white py-2 px-4 rounded-md'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className='text-base font-semibold bg-blue-600 text-white py-2 px-4 rounded-md'
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const navigate = useNavigate();

    // Navigate to the edit resume page
    const handleEditResume = () => {
        window.location.href = '/edit';
    };

    // State for managing the modal visibility and the template name
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [templateName, setTemplateName] = useState('Yellow Template');

    const handleEditClick = () => {
        setIsModalOpen(true); // Open the modal when the edit button is clicked
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    const submitEdit = (newName) => {
        setTemplateName(newName); // Update the template name
    };

    // State to store fetched resumes with template data
    const [resumes, setResumes] = useState([]);

    // Fetch resumes and templates on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userEmail = 'user@example.com'; // Replace with the actual user email
                const data = await fetchUserResumesWithTemplates(userEmail);
                setResumes(data);
            } catch (error) {
                console.error('Error fetching resumes:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className='min-h-screen bg-gray-100'>
            <div className='container mx-auto py-8 space-y-10 pt-16'>
                <h2 className='mt-10 text-center text-2xl font-bold tracking-tight text-gray-900'>
                    My Dashboard
                </h2>

                {/* Tab Navigation */}
                <div className='mb-8 flex ml-auto'>
                    <div className='flex'>
                        <button
                            onClick={() => {}}
                            className='relative group text-lg font-semibold px-4 py-2 text-gray-900 flex items-center'
                        >
                            <img
                                className='w-5 h-5 mb-8 hover:text-purple-500 translate-y-[12px] mr-3'
                                src={resumeic}
                                alt='resume tab'
                            />
                            Resumes
                            <span className='absolute bottom-0 left-0 w-full h-1 bg-transparent group-hover:bg-purple-600 transform scale-x-0 transition-all duration-300 ease-in-out group-hover:scale-x-100'></span>
                            <span className='absolute bottom-[-4px] left-0 w-[300%] h-[0.5px] bg-gray-300'></span>
                        </button>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className='p-3 flex flex-wrap space-x-8 justify-center'>
                    {/* First Card (Create Resume) */}
                    <div
                        className='max-w-sm w-[325px] px-2 py-[120px] bg-gray-100 border-2 border-dotted border-black rounded-lg shadow-lg hover:cursor-pointer hover:bg-gray-200 hover:border-purple-500'
                        onClick={() =>
                            (window.location.href = '/create-resume')
                        }
                    >
                        <div className='flex flex-col justify-center py-12 items-center'>
                            <div className='flex justify-center items-center'>
                                <img
                                    className='w-10 h-10 mb-8 hover:text-purple-500'
                                    src={cv}
                                    alt='cv'
                                />
                            </div>
                            <div className='flex flex-col justify-center'>
                                <p className='text-center text-black text-lg font-semibold hover:text-purple-500'>
                                    Create Resume
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Cards from Firebase */}
                    {resumes.map((resume) => (
                        <div
                            key={resume.id}
                            className='max-w-sm w-[325px] px-0 py-0 bg-gray-100 border-2 border-black-500 rounded-lg shadow-lg'
                        >
                            <div className='flex flex-col justify-center items-center'>
                                <div className='flex justify-center items-center w-full group relative'>
                                    <img
                                        src={resume.imageUrl}
                                        alt='Resume'
                                        className='h-[280px] w-full object-cover object-top group-hover:filter group-hover:brightness-50 transition-all duration-300 ease-in-out'
                                    />
                                    <div className='group-hover:block hidden absolute top-15 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-sm py-4 px-4 rounded cursor-pointer'>
                                        <button
                                            onClick={() =>
                                                navigate(`/edit/${resume.id}`)
                                            }
                                            className='w-full text-center font-semibold'
                                        >
                                            Edit Resume
                                        </button>
                                    </div>
                                </div>

                                <div className='p-4'>
                                    <h1 className='text-lg font-semibold mb-3 text-center'>
                                        {resume.templateName ||
                                            'Untitled Resume'}
                                    </h1>
                                    <p className='text-base leading-relaxed mb-12 text-center'>
                                        Created on:{' '}
                                        {new Date(
                                            resume.createdAt.seconds * 1000,
                                        ).toLocaleDateString()}
                                    </p>
                                    <p className='text-base leading-relaxed mb-12 text-center'>
                                        Template ID: {resume.templateId}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal for Editing the Name */}
                <EditModal
                    isOpen={isModalOpen}
                    closeModal={closeModal}
                    submitEdit={submitEdit}
                    currentName={templateName}
                />
            </div>
        </div>
    );
}
