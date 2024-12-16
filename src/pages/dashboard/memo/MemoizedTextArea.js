import React, {memo} from 'react';

export const MemoizedTextArea = memo(
    ({value, onChange, disabled = false, rows = 5, field}) => {
        const handleChange = (e) => {
            // Pass the entire event value, not just the target value
            onChange(e.target.value, field);
        };

        return (
            <textarea
                value={value || ''}
                onChange={handleChange}
                disabled={disabled}
                rows={rows}
                className='w-full px-3 py-2 border border-[#CDC1FF]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CDC1FF]/50 transition-all duration-300'
                data-field-id={field}
            />
        );
    },
);
