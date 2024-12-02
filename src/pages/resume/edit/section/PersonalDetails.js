import React from 'react';

const PersonalDetails = ({ personalDetail, handleInputChange }) => (
    <div id="personal" className="border-b border-gray-300 pb-6">
        <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-600">Use a permanent address where you can receive mail.</p>
        <div className="space-y-4">
            {["name", "email", "phone", "address"].map((field) => (
                <div key={field}>
                    <label className="block text-sm font-medium text-gray-900">
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                    </label>
                    <input
                        type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={personalDetail[field]}
                        onChange={(e) => handleInputChange('personalDetail', field, e.target.value)}
                        className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                    />
                </div>
            ))}
        </div>
    </div>
);

export default PersonalDetails;