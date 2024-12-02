import React from 'react';

const Skills = ({ skills, setResumeData }) => (
    <div id="skill" className="border-b border-gray-300 pb-6">
        <h3 className="text-sm font-medium text-gray-900">Skills</h3>
        <textarea
            placeholder="Use '-' or '*' for bullet points, or '1.', '2.' for numbered list."
            value={skills}
            onChange={(e) => setResumeData((prev) => ({ ...prev, skills: e.target.value }))}
            className="block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
        />
    </div>
);

export default Skills;