import React from 'react';

const ProfilePhoto = ({ handlePhotoChange }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">Profile Photo: </label>
        <input 
            type="file" 
            accept="image/*" 
            onChange={handlePhotoChange} 
            className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
        />
    </div>
);

export default ProfilePhoto;