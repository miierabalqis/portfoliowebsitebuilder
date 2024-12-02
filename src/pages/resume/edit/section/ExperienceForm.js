import React from 'react';

const Experience = ({ experience, handleArrayChange, addEntry, removeEntry }) => (
    <div id="experience" className="border-b border-gray-300 pb-6">
        <h3 className="text-base font-semibold text-gray-900">Experience</h3>
        {experience.map((exp, index) => (
            <div key={index} className="space-y-4 border rounded-md p-4 mb-4 relative">
                <button
                    type="button"
                    onClick={() => removeEntry('experience', index)}
                    className="absolute top-2 right-2 bg-red-600 text-white text-sm px-2 py-1 rounded-md"
                >
                    Remove
                </button>
                {["company", "position", "startDate", "endDate", "description"].map((field) => (
                    <div key={field}>
                        <label className="block text-sm font-medium text-gray-900">
                            {field.charAt(0).toUpperCase() + field.replace(/([A-Z])/g, ' $1').slice(1)}:
                        </label>
                        <input
                            type={field.includes("Date") ? "date" : "text"}
                            placeholder={field.charAt(0).toUpperCase() + field.replace(/([A-Z])/g, ' $1').slice(1)}
                            value={field === "endDate" && exp[field] === "Present" ? "" : exp[field]}
                            onChange={(e) =>
                                handleArrayChange('experience', index, field, e.target.value)
                            }
                            disabled={field === "endDate" && exp[field] === "Present"}
                            className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
                        />
                        {field === "endDate" && (
                            <div className="block text-sm font-medium text-gray-900">
                                <input
                                    type="checkbox"
                                    onClick={() =>
                                        handleArrayChange('experience', index, 'endDate', exp.endDate === "Present" ? "" : "Present")
                                    }
                                    checked={exp.endDate === "Present"}
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
            onClick={() => addEntry('experience')}
            className="text-sm text-indigo-600"
        >
            Add Experience
        </button>
    </div>
);

export default Experience;