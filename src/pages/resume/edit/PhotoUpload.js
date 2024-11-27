import React, {useState} from 'react';
import {projectStorage} from '../../../firebase/config'; // Make sure your Firebase config is correctly imported
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';

function ProfilePhotoUpload({setProfilePhoto}) {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        // Validate file type (optional)
        if (selectedFile && !selectedFile.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        setFile(selectedFile);
    };

    // Handle file upload to Firebase Storage
    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first');
            return;
        }

        setIsUploading(true);

        // Use a unique name for the file to avoid overwriting
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(projectStorage, `profilePhotos/${fileName}`);

        try {
            // Upload the file to Firebase Storage
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            // Set the profile photo URL in the parent component state
            setProfilePhoto(downloadURL);

            alert('Profile photo uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error.message);
            alert(`Failed to upload photo: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <input type='file' onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload Photo'}
            </button>
            {file && <p>{file.name}</p>} {/* Show selected file name */}
        </div>
    );
}

export default ProfilePhotoUpload;
