//Dashboard.js

import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import cv from '../../assets/images/add.png';
import resume from '../../assets/images/resume2.jpg';
import edit from '../../assets/images/dashboard/edit2.png';
import resumeic from '../../assets/images/dashboard/resumeic.png';
import editname from '../../assets/images/dashboard/editname.png';
import view from '../../assets/images/dashboard/view.png';
import del from '../../assets/images/dashboard/delete.png';

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

    return (
        <div className='min-h-screen bg-gray-100'>
            <div className='container mx-auto py-8 space-y-10 pt-16'>
                <h2 className='mt-10 text-center text-2xl font-bold tracking-tight text-gray-900'>
                    My Dashboard
                </h2>

                {/* Tab Navigation */}
                <div className='mb-8 flex ml-auto '>
                    <div className='flex'>
                        {/* Resumes Tab*/}
                        <button
                            onClick={() => {}}
                            className='relative group text-lg font-semibold px-4 py-2 text-gray-900 flex items-center'
                        >
                            {/* Icon beside the text */}
                            <i className='fas fa-file-alt mr-2'></i>{' '}
                            <img
                                className='w-5 h-5 mb-8 hover:text-purple-500 translate-y-[12px] mr-3'
                                src={resumeic}
                                alt='resume tab'
                            />
                            Resumes
                            {/* Long line under the tab */}
                            <span className='absolute bottom-0 left-0 w-full h-1 bg-transparent group-hover:bg-purple-600 transform scale-x-0 transition-all duration-300 ease-in-out group-hover:scale-x-100'></span>
                            <span className='absolute bottom-[-4px] left-0 w-[300%] h-[0.5px] bg-gray-300'></span>
                        </button>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className='p-3 flex space-x-8 justify-center'>
                    {/* First Card */}
                    <div
                        className='max-w-sm w-[325px] px-2 py-[120px] bg-gray-100 border-2 border-dotted border-black rounded-lg shadow-lg hover:cursor-pointer hover:bg-gray-200 hover:border-purple-500'
                        onClick={() =>
                            (window.location.href = '/create-resume')
                        } // navigate to create resume page
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

                    {/* Second Card */}
                    <div className='max-w-sm w-[325px] px-0 py-0 bg-gray-100 border-2 border-black-500 rounded-lg shadow-lg'>
                        <div className='flex flex-col justify-center items-center'>
                            <div className='flex justify-center items-center w-full group relative'>
                                <img
                                    src={resume}
                                    alt='Resume'
                                    className='h-[280px] w-full object-cover object-top group-hover:filter group-hover:brightness-50 group-hover:bg-purple-500 transition-all duration-300 ease-in-out'
                                />
                                {/* Edit Resume button on top of the image (visible on hover) */}
                                <div className='group-hover:block hidden absolute top-15 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-sm py-4 px-4 rounded cursor-pointer'>
                                    <button
                                        onClick={handleEditResume}
                                        className='w-full text-center font-semibold'
                                    >
                                        Edit Resume
                                    </button>
                                </div>
                            </div>

                            <div className='flex flex-col justify-center'>
                                {/* Text Section */}
                                <div className='p-4'>
                                    <div className='flex items-center justify-center'>
                                        <h1 className='text-lg font-semibold mb-3 text-center'>
                                            {templateName} {/* Editable name */}
                                        </h1>
                                        {/* Edit button next to name */}
                                        <button
                                            onClick={handleEditClick}
                                            className='ml-4 text-indigo-300 inline-flex items-center'
                                            style={{
                                                transform: 'translateY(-5px)', //adjust position
                                            }}
                                        >
                                            <img
                                                src={editname}
                                                alt='Edit name'
                                                className='w-5 h-5'
                                            />
                                        </button>
                                    </div>

                                    <p className='text-base leading-relaxed mb-12 text-center'>
                                        Lorem ipsum dolor sit amet.
                                    </p>
                                    <div className='flex items-center justify-between w-full'>
                                        {/* Edit button */}
                                        <div className='group relative'>
                                            <a
                                                onClick={handleEditResume}
                                                className='text-indigo-300 inline-flex items-center md:mb-2 lg:mb-0'
                                            >
                                                <img
                                                    src={edit}
                                                    alt='Edit'
                                                    className='w-5 h-5'
                                                />
                                            </a>
                                            {/* Tooltip for Edit */}
                                            <div className='group-hover:block hidden absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded'>
                                                Edit
                                            </div>
                                        </div>

                                        {/* Preview button */}
                                        <div className='group relative'>
                                            <a
                                                onClick={handleEditClick} //change to navigate to preview page
                                                className='text-indigo-300 inline-flex items-center md:mb-2 lg:mb-0'
                                            >
                                                <img
                                                    src={view}
                                                    alt='View'
                                                    className='w-5 h-5'
                                                />
                                            </a>
                                            {/* Tooltip for Preview */}
                                            <div className='group-hover:block hidden absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded'>
                                                Preview
                                            </div>
                                        </div>

                                        {/* Delete button */}
                                        <div className='group relative'>
                                            <a
                                                onClick={handleEditClick} //change to navigate to delete
                                                className='text-indigo-300 inline-flex items-center md:mb-2 lg:mb-0'
                                            >
                                                <img
                                                    src={del}
                                                    alt='Delete'
                                                    className='w-5 h-5'
                                                />
                                            </a>
                                            {/* Tooltip for Delete */}
                                            <div className='group-hover:block hidden absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded'>
                                                Delete
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
