import React from 'react';

const Education = ({ educationDetail, handleArrayChange, addEntry, removeEntry }) => (
    <div id="education" className="border-b border-gray-300 pb-6">
        <h3 className="text-base font-semibold text-gray-900">Education</h3>
        {educationDetail.map((edu, index) => (
            <div key={index} className="space-y-4 border rounded-md p-4 mb-4 relative">
                <button
                    type="button"
                    onClick={() => removeEntry('educationDetail', index)}
                    className="absolute top-2 right-2 bg-red-600 text-white text-sm px-2 py-1 rounded-md"
                >
                    Remove
                </button>
                {["level", "institution", "course", "result", "startDate", "endDate"].map((field) => (
                    <div key={field}>
                        <label className="block text-sm font-medium text-gray-900">
                            {field.charAt(0).toUpperCase() + field.replace(/([A-Z])/g, ' $1').slice(1)}:
                        </label>
                        <input
                            type={field.includes("Date") ? "date" : "text"}
                            placeholder={field.charAt(0).toUpperCase() + field.replace(/([A-Z])/g, ' $1').slice(1)}
                            value={field === "endDate" && edu[field] === "Present" ? "" : edu[field]}
                            onChange={(e) =>
                                handleArrayChange('educationDetail', index, field, e.target.value)
                            }
                            disabled={field === "endDate" && edu[field] === "Present"}
                            className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                        />
                        {field === "endDate" && (
                            <div className="block text-sm font-medium text-gray-900">
                                <input
                                    type="checkbox"
                                    onClick={() =>
                                        handleArrayChange('educationDetail', index, 'endDate', edu.endDate === "Present" ? "" : "Present")
                                    }
                                    checked={edu.endDate === "Present"}
                                />
                                Present
                            </div>
                        )}
                    </div>
                ))}
            </div>
        ))}
        <button
            type="button"
            onClick={() => addEntry('educationDetail')}
            className="text-sm text-indigo-600"
        >
            Add Education
        </button>
    </div>
);

export default Education;