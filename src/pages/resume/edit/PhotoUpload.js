import React, {useState} from 'react';
import {
    projectStorage,
    projectFirestore,
    projectAuth,
} from '../../../firebase/config';
import {ref, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage';
import {doc, updateDoc} from 'firebase/firestore';

function ProfilePhotoUpload({setProfilePhoto}) {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile && !selectedFile.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        setFile(selectedFile);
        // Automatically trigger upload when file is selected
        handleUpload(selectedFile);
    };

    // Handle file upload to Firebase Storage and update Firestore
    const handleUpload = async (selectedFile) => {
        const fileToUpload = selectedFile || file;
        if (!fileToUpload) {
            alert('Please select a file first');
            return;
        }

        // Get current user
        const currentUser = projectAuth.currentUser;
        if (!currentUser) {
            alert('You must be logged in to update profile photo');
            return;
        }

        setIsUploading(true);

        try {
            console.log('Starting upload for file:', selectedFile.name);

            // Generate unique filename
            const fileName = `${currentUser.uid}_${Date.now()}_${
                fileToUpload.name
            }`;
            const storageRef = ref(projectStorage, `profilePhotos/${fileName}`);

            // Add metadata to make the file public
            const metadata = {
                contentType: fileToUpload.type,
                cacheControl: 'public, max-age=31536000',
            };

            // Upload new file
            await uploadBytes(storageRef, fileToUpload, metadata);

            // Get download URL of new file
            const downloadURL = await getDownloadURL(storageRef);

            // Add this logging
            console.log('Generated download URL:', downloadURL);

            // Update Firestore document with new photo URL
            const userDocRef = doc(projectFirestore, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
                profilePhoto: downloadURL,
            });

            // Update local state
            setProfilePhoto(downloadURL);

            alert('Profile photo updated successfully');
        } catch (error) {
            console.error('Upload error details:', {
                error,
                fileName: fileToUpload.name,
                userId: currentUser.uid,
            });
            alert(`Failed to upload photo: ${error.message}`);
        }
        // } catch (error) {
        //     console.error('Error uploading file:', error.message);
        //     alert(`Failed to upload photo: ${error.message}`);
        // } finally {
        //     setIsUploading(false);
        // }
    };

    return (
        <div className='flex flex-col items-center space-y-2'>
            {/* Hidden file input */}
            <input
                type='file'
                onChange={handleFileChange}
                className='hidden'
                id='photo-upload'
                accept='image/*'
            />

            {/* Styled label as button */}
            <label
                htmlFor='photo-upload'
                className={`
                    flex items-center justify-center
                    px-4 py-2 rounded
                    ${
                        isUploading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                    }
                    text-white
                    transition duration-200
                    w-full max-w-[200px]
                `}
            >
                {isUploading ? (
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
                                d='M4 12a8 8 0 018-8V0C5.373 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                        </svg>
                        Uploading...
                    </span>
                ) : (
                    'Upload Photo'
                )}
            </label>

            {/* Display selected file name */}
            {file && !isUploading && (
                <p className='text-sm text-gray-600 text-center'>{file.name}</p>
            )}
        </div>
    );
}

export default ProfilePhotoUpload;
