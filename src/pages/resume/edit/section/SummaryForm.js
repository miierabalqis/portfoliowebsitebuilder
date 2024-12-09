import React from 'react';

const Summary = ({summary, onChange}) => (
    <div id='summary' className='border-b border-gray-300 pb-6'>
        <h3 className='text-base font-semibold text-gray-900'>Summary</h3>
        <textarea
            placeholder="Use '-' or '*' for bullet points, or '1.', '2.' for numbered list."
            value={summary || ''} // Ensure value is always a string
            onChange={(e) => onChange(e.target.value)}
            className='block w-full px-4 py-2 border rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600'
        />
    </div>
);

export default Summary;
